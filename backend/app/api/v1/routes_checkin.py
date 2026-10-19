from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import create_session_token, new_session_id
from app.db.session import get_db
from app.models.booking import Booking
from app.models.guest import Guest
from app.models.verification_log import VerificationLog
from app.schemas.checkin import CheckinCompleteRequest, CheckinCompleteResponse, SessionCreateResponse

router = APIRouter(prefix="/checkin", tags=["checkin"])


@router.post("/session", response_model=SessionCreateResponse)
def start_session():
    """Start a new guest check-in session. Returns a session_id + short-lived token
    that the frontend attaches to subsequent requests (OCR, face verify, etc.)."""
    session_id = new_session_id()
    token = create_session_token(session_id)
    return SessionCreateResponse(session_id=session_id, token=token)


@router.post("/complete", response_model=CheckinCompleteResponse)
def complete_checkin(payload: CheckinCompleteRequest, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.guest_id == payload.guest_id).first()
    if guest is None:
        raise HTTPException(status_code=404, detail="Guest not found")

    booking = db.query(Booking).filter(Booking.booking_id == payload.booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status == "CHECKED_IN":
        # Guards against a double-submit (e.g. a retried request) marking
        # the same booking as checked in twice, or logging a second
        # verification event for a check-in that already succeeded.
        raise HTTPException(status_code=409, detail="This booking has already been checked in.")

    log = VerificationLog(
        guest_id=guest.guest_id,
        session_id=payload.session_id,
        result="SUCCESS",
    )
    db.add(log)

    # This is the actual "lock" against re-check-in: once a booking's
    # status flips to CHECKED_IN, MatchingService.find_matching_booking()
    # will refuse to match this guest again on any future scan attempt.
    booking.status = "CHECKED_IN"

    db.commit()

    return CheckinCompleteResponse(
        status="SUCCESS",
        room_number=booking.room_number,
        message="Check-in complete. Enjoy your stay!",
    )
