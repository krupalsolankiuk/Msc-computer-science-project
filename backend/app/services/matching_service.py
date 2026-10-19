from datetime import date

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.models.guest import Guest


class MatchingService:
    """Cross-references extracted guest identity against booking records,
    and persists a Guest row for any successful match so downstream steps
    (face verification logging, check-in completion) have a real record
    to reference.

    A booking that has already been fully checked in (status
    "CHECKED_IN", set by /checkin/complete) is deliberately excluded from
    matching — re-scanning the same guest's ID a second time should not
    silently let them "check in" again.
    """

    def find_matching_booking(
        self,
        db: Session,
        full_name: str,
        document_number: str | None = None,
        date_of_birth: date | None = None,
    ) -> dict:
        # Note: status is intentionally NOT filtered in this first lookup —
        # we need to find the booking regardless of its status so we can
        # tell the difference between "no such booking" and "found it, but
        # this guest already checked in" and return the right message for
        # each, rather than both looking like a generic "not found".
        booking = (
            db.query(Booking)
            .filter(func.lower(Booking.guest_full_name) == full_name.strip().lower())
            .first()
        )

        if booking is None and document_number:
            booking = (
                db.query(Booking)
                .filter(or_(Booking.passport_no == document_number))
                .first()
            )

        if booking is None:
            return {"matched": False, "reason": "No confirmed booking found for supplied identity."}

        if booking.status == "CHECKED_IN":
            return {
                "matched": False,
                "reason": "This guest has already been checked in for this booking.",
            }

        if booking.status != "CONFIRMED":
            return {
                "matched": False,
                "reason": f"This booking is not eligible for check-in (status: {booking.status}).",
            }

        # Reuse an existing Guest row for this booking if the guest has
        # already scanned/matched once but not yet completed check-in
        # (e.g. they went back a step), instead of creating a fresh
        # duplicate row on every attempt.
        guest = (
            db.query(Guest)
            .filter(Guest.booking_id == booking.booking_id)
            .order_by(Guest.created_at.desc())
            .first()
        )

        if guest is None:
            guest = Guest(booking_id=booking.booking_id)
            db.add(guest)

        guest.full_name = full_name
        guest.date_of_birth = date_of_birth
        guest.document_number = document_number

        db.commit()
        db.refresh(guest)

        return {
            "matched": True,
            "booking_id": booking.booking_id,
            "guest_id": guest.guest_id,
            "room_number": booking.room_number,
            "room_type": booking.room_type,
            "check_in_date": booking.check_in_date,
            "check_out_date": booking.check_out_date,
            "reason": None,
        }
