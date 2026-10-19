import re
from datetime import date, datetime

import pytesseract
from PIL import Image, ImageOps

from app.core.config import settings

pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD

# Fallback patterns used only when no usable MRZ lines are found at all.
_FALLBACK_DATE_RE = re.compile(r"(\d{2})(\d{2})(\d{2})")
_FALLBACK_DOC_NO_RE = re.compile(r"\b(?=[A-Z0-9]{6,9}\b)(?=[A-Z0-9]*\d)[A-Z0-9]{6,9}\b")


class OCRService:
    """Wraps Tesseract OCR to extract structured identity fields from an
    uploaded passport image.

    Parses the ICAO 9303 TD3 machine-readable zone (the two 44-character
    lines at the bottom of a passport bio page) rather than pattern-matching
    over the whole page, since that's the one part of a passport with a
    fixed, standardised layout. Printed fields on the visual page vary far
    too much between issuing countries/formats to parse reliably with OCR.

    TD3 MRZ layout (each line nominally 44 characters):
      Line 1: P<CCCSURNAME<<GIVEN<NAMES<<<<<<<<<<<<<<<<<<<<
              [0]    document type ('P' for passport)
              [1]    '<' filler
              [2:5]  issuing country code (3 letters)
              [5:]   SURNAME<<GIVEN<NAMES<filler...

      Line 2: NNNNNNNNNC CCC YYMMDDC S YYMMDDC PPPPPPPPPPPPPPPC CD
              [0:9]   document number (9 chars, '<' padded)
              [9]     document number check digit
              [10:13] nationality (3 letters)
              [13:19] date of birth YYMMDD
              [19]    DOB check digit
              [20]    sex (M/F/<)
              [21:27] expiry date YYMMDD
              [27]    expiry check digit
              [28:42] optional personal number field
              [42]    personal number check digit
              [43]    overall check digit

    Real-world OCR output rarely lands on exactly 44 characters per line
    (dropped/added characters, stray spaces from font kerning, etc.), so
    parsing below is defensive: it works from whatever length is actually
    recovered rather than assuming a hard 44-character slice, and any
    field it can't extract with reasonable confidence is left as None
    rather than guessed.
    """

    def _preprocess(self, image_path: str) -> Image.Image:
        img = Image.open(image_path)
        img = ImageOps.exif_transpose(img)          # fix camera rotation
        img = img.convert("L")                       # greyscale
        img = ImageOps.autocontrast(img)              # improve contrast
        return img

    def extract_identity(self, image_path: str) -> dict:
        img = self._preprocess(image_path)
        raw_text = pytesseract.image_to_string(img)
        fields = self._parse_fields(raw_text)
        fields["raw_text"] = raw_text
        return fields

    # ------------------------------------------------------------------
    # Field parsing
    # ------------------------------------------------------------------

    def _parse_fields(self, text: str) -> dict:
        mrz_lines = self._find_mrz_lines(text)

        full_name: str | None = None
        nationality: str | None = None
        document_number: str | None = None
        dob: date | None = None
        sex: str | None = None

        if mrz_lines:
            country, surname, given_names = self._parse_mrz_line1(mrz_lines[0])
            nationality = country or nationality
            name_parts = [p for p in (surname, given_names) if p]
            full_name = " ".join(name_parts) if name_parts else None

        if len(mrz_lines) >= 2:
            doc_no, nat2, dob2, sex2 = self._parse_mrz_line2(mrz_lines[1])
            document_number = doc_no
            nationality = nationality or nat2
            dob = dob2
            sex = sex2

        # Fall back to loose whole-text heuristics only if the MRZ itself
        # couldn't be found or didn't yield a field (e.g. line 2 missing).
        if document_number is None:
            document_number = self._guess_document_number(text)
        if dob is None:
            dob = self._guess_dob(text)

        confidence = self._estimate_confidence(full_name, document_number, dob, nationality)

        return {
            "full_name": full_name,
            "document_number": document_number,
            "date_of_birth": dob,
            "document_type": "PASSPORT" if (mrz_lines or "PASSPORT" in text.upper()) else "ID_CARD",
            "nationality": nationality,
            "confidence": confidence,
            "sex": sex,
        }

    # ------------------------------------------------------------------
    # MRZ line detection
    # ------------------------------------------------------------------

    def _find_mrz_lines(self, text: str) -> list[str]:
        """Return the MRZ line(s), in order, best-guessed from raw OCR text.

        MRZ lines are the strongest visual signal on the whole page: long
        runs of uppercase letters, digits, and '<' filler with almost no
        other punctuation. Line 1 (names) is '<'-heavy; line 2 (document
        number, dates, sex) is mostly digits with only one or two '<'
        fillers — so filler-count alone isn't a reliable signal for both
        lines. Instead we require the line to be made up almost entirely
        of MRZ-legal characters (A-Z, 0-9, '<') AND either be long enough
        to plausibly be a full MRZ line, or '<'-dense enough to clearly be
        a names line.
        """
        mrz_char_re = re.compile(r"^[A-Z0-9<]+$")
        candidates = []
        for raw_line in text.splitlines():
            # Collapse stray OCR-inserted spaces before scoring, since
            # kerning artifacts (e.g. "SHUJ EN" instead of "SHUJEN") are
            # common and shouldn't disqualify an otherwise valid MRZ line.
            compact = raw_line.replace(" ", "")
            if len(compact) < 20:
                continue
            if not mrz_char_re.match(compact):
                continue
            filler_count = compact.count("<")
            if filler_count < 1:
                continue
            if len(compact) >= 30 or filler_count >= 5:
                candidates.append(compact)

        return candidates[:2]

    def _parse_mrz_line1(self, line: str) -> tuple[str | None, str | None, str | None]:
        """Parse 'P<CCCSURNAME<<GIVEN<NAMES<<<...' -> (country, surname, given_names)."""
        # Strip the leading document-type character(s) up to the first '<'
        # then the next 3 characters are the issuing country code.
        if "<" not in line:
            return None, None, None

        after_doc_type = line.split("<", 1)[1] if line[0] not in "<" else line[1:]
        # after_doc_type now starts at the country code, e.g. "WSACHANG<<SHUJEN<<<<"
        if len(after_doc_type) < 4:
            return None, None, None

        country = after_doc_type[:3] or None
        remainder = after_doc_type[3:]

        parts = remainder.split("<<", 1)
        surname_raw = parts[0]
        given_raw = parts[1] if len(parts) > 1 else ""

        surname = self._clean_mrz_text(surname_raw)
        given_names = self._clean_mrz_text(given_raw)

        return country, surname or None, given_names or None

    def _parse_mrz_line2(
        self, line: str
    ) -> tuple[str | None, str | None, date | None, str | None]:
        """Parse the TD3 second MRZ line for document number, nationality,
        DOB, and sex.

        Rather than slicing at fixed character offsets (fragile — a single
        dropped/misread character anywhere before a field shifts every
        offset after it, which is common with real OCR output), this
        anchors on the one unambiguous, fixed-format run in the line: a
        3-letter nationality code immediately followed by a 6-digit DOB,
        a sex marker, and a 6-digit expiry date. Everything before that
        anchor is treated as the document number.
        """
        match = re.search(r"([A-Z]{3})(\d{6})\d?([MF<])(\d{6})", line)
        if not match:
            return None, None, None, None

        nationality = match.group(1)
        dob = self._parse_yymmdd(match.group(2))
        sex_raw = match.group(3)
        sex = sex_raw if sex_raw in ("M", "F") else None

        doc_no_segment = line[: match.start(1)].replace("<", "")
        # The character immediately before the nationality code is almost
        # always the document-number check digit, not part of the number
        # itself, when the full 9-char-number + check-digit run is intact.
        if len(doc_no_segment) > 9:
            doc_no_segment = doc_no_segment[:-1]
        document_number = doc_no_segment[:9] or None

        return document_number, nationality, dob, sex

    @staticmethod
    def _clean_mrz_text(value: str) -> str:
        # Replace filler characters with spaces, then collapse whitespace
        # (this also absorbs stray OCR-inserted spaces within a name).
        cleaned = value.replace("<", " ")
        return " ".join(cleaned.split())

    @staticmethod
    def _parse_yymmdd(digits: str) -> date | None:
        if not re.fullmatch(r"\d{6}", digits):
            return None
        yy, mm, dd = digits[0:2], digits[2:4], digits[4:6]
        try:
            year = int(yy)
            year += 2000 if year < 30 else 1900
            return datetime(year, int(mm), int(dd)).date()
        except ValueError:
            return None

    # ------------------------------------------------------------------
    # Confidence scoring
    # ------------------------------------------------------------------

    def _estimate_confidence(
        self,
        full_name: str | None,
        document_number: str | None,
        dob: date | None,
        nationality: str | None,
    ) -> float:
        """A simple, explainable confidence score: percentage of the four
        key identity fields that were successfully extracted. This is a
        proxy, not a calibrated accuracy measure — for your evaluation
        chapter you should replace/supplement this with real precision
        figures measured against a labelled set of test documents.
        """
        fields = [full_name, document_number, dob, nationality]
        filled = sum(1 for f in fields if f)
        return round((filled / len(fields)) * 100, 2)

    # ------------------------------------------------------------------
    # Fallback heuristics (used only when no MRZ could be located)
    # ------------------------------------------------------------------

    def _guess_document_number(self, text: str) -> str | None:
        matches = _FALLBACK_DOC_NO_RE.findall(text.upper())
        return matches[0] if matches else None

    def _guess_dob(self, text: str) -> date | None:
        match = _FALLBACK_DATE_RE.search(text)
        if not match:
            return None
        yy, mm, dd = match.groups()
        try:
            year = int(yy)
            year += 2000 if year < 30 else 1900
            return datetime(year, int(mm), int(dd)).date()
        except ValueError:
            return None
