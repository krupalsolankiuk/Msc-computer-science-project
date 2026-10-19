from datetime import date

from app.services.ocr_service import OCRService

# Real (imperfect) Tesseract output captured from the "World Passport"
# sample document during manual testing, reproduced here as a regression
# fixture. Note the OCR-introduced space in "SHUJ EN" (should be
# "SHUJEN") — this is a genuine OCR artefact, not a parser bug, and is
# intentionally left uncorrected so the test reflects real-world input.
WORLD_PASSPORT_RAW_TEXT = (
    "IMPORTANT\n\nThis document is valid in all countries unless\n"
    "otherwise restricted. It is not transferable. It is for\n"
    "use solely by the person to whom it is issued. The\n"
    "...\n\n"
    "P<WSACHANG<<SHUJ EN<<<<<<<<<<<<<<<<<<<<<<<<<<\n"
)

# Real Tesseract output from a standard Indian passport MRZ (TD3, two
# lines). Used to check the parser against a "clean" MRZ with both lines
# correctly recovered.
INDIAN_PASSPORT_RAW_TEXT = (
    "REPUBLIC OF INDIA\nTHAPLIYAL GARIMA\n\n"
    "P<INDTHAPLIYAL<<GARIMA<<<<<<<<<<<<<<<<<<<<<<\n"
    "SP0033692IND9407015F3409028106526956412<0\n"
)


def test_parses_name_from_world_passport_mrz():
    service = OCRService()
    result = service._parse_fields(WORLD_PASSPORT_RAW_TEXT)
    # Country code no longer leaks into the name (previous bug produced
    # "P WSACHANG SHUJ EN"); the space-collapsing MRZ-line detection also
    # fixes the OCR kerning artifact ("SHUJ EN" -> "SHUJEN") for free.
    assert result["full_name"] == "CHANG SHUJEN"
    assert result["nationality"] == "WSA"
    assert result["document_type"] == "PASSPORT"


def test_parses_indian_passport_mrz_both_lines():
    service = OCRService()
    result = service._parse_fields(INDIAN_PASSPORT_RAW_TEXT)
    assert result["full_name"] == "THAPLIYAL GARIMA"
    assert result["nationality"] == "IND"
    assert result["document_number"] == "SP0033692"
    assert result["date_of_birth"] == date(1994, 7, 1)
    assert result["sex"] == "F"


def test_confidence_reflects_fields_extracted():
    service = OCRService()
    result = service._parse_fields(INDIAN_PASSPORT_RAW_TEXT)
    # All four scored fields (name, doc number, dob, nationality) present.
    assert result["confidence"] == 100.0


def test_confidence_lower_when_fields_missing():
    service = OCRService()
    # No MRZ at all, no dates, no plausible document number.
    result = service._parse_fields("just some random unrelated text")
    assert result["confidence"] == 0.0
    assert result["full_name"] is None


def test_mrz_line1_parsing_directly():
    service = OCRService()
    country, surname, given = service._parse_mrz_line1(
        "P<INDTHAPLIYAL<<GARIMA<<<<<<<<<<<<<<<<<<<<<<"
    )
    assert country == "IND"
    assert surname == "THAPLIYAL"
    assert given == "GARIMA"


def test_mrz_line2_parsing_directly():
    service = OCRService()
    doc_no, nationality, dob, sex = service._parse_mrz_line2(
        "SP0033692IND9407015F3409028106526956412<0"
    )
    assert doc_no == "SP0033692"
    assert nationality == "IND"
    assert dob == date(1994, 7, 1)
    assert sex == "F"


def test_fallback_document_number_ignores_plain_words():
    # Regression test for the original bug: words like "PASSPORT" (all
    # letters, no digit) must never be picked up as a document number.
    service = OCRService()
    result = service._guess_document_number("PASSPORT ISSUED BY AUTHORITY X1234567")
    assert result == "X1234567"
    assert result != "PASSPORT"


def test_mrz_detection_ignores_allcaps_headings_without_filler():
    # Regression test: a printed all-caps heading with no '<' characters
    # (e.g. "WORLD GOVERNMENT OF WORLD CITIZENS") was previously
    # misclassified as an MRZ line purely because it was long and
    # all-uppercase, displacing the real MRZ line and breaking extraction.
    service = OCRService()
    raw = (
        "WORLD GOVERNMENT OF WORLD CITIZENS\n\n"
        "P<WSACHANG<<SHUJEN<<<<<<<<<<<<<<<<<<<<<<<<<<\n"
    )
    result = service._parse_fields(raw)
    assert result["full_name"] == "CHANG SHUJEN"
    assert result["nationality"] == "WSA"


def test_full_pipeline_matches_user_reported_world_passport_scan():
    # End-to-end regression using the near-verbatim raw OCR text reported
    # from a real test scan, including surrounding boilerplate passport
    # text that previously confused MRZ-line detection.
    service = OCRService()
    raw = (
        "IMPORTANT\n\nThis document is valid in all countries unless\n"
        "otherwise restricted. It is not transferable. It is for\n"
        "use solely by the person to whom it is issued. The\n\n"
        "WORLD GOVERNMENT OF WORLD CITIZENS\n\n"
        "Type/Type\nP WSA\n\nPassport/Passeport\n\nName/Nom (1)\n\nCHANG\n\n"
        "Given names/Prénoms (2)\n\nSHUJEN\nSHENYANG\n\n14 Oct 1993\n\n"
        "P<WSACHANG<<SHUJ EN<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n"
        "<<<'WSA -\n\n<<<<<<<<<<<<<<\n"
    )
    result = service._parse_fields(raw)
    assert result["full_name"] == "CHANG SHUJEN"
    assert result["nationality"] == "WSA"
    assert result["document_type"] == "PASSPORT"
