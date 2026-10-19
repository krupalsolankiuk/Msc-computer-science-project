from datetime import date
from uuid import UUID

from pydantic import BaseModel


class SessionCreateResponse(BaseModel):
    session_id: UUID
    token: str


class OCRResult(BaseModel):
    full_name: str | None = None
    date_of_birth: date | None = None
    document_type: str | None = None
    document_number: str | None = None
    nationality: str | None = None
    confidence: float | None = None
    raw_text: str


class FaceVerifyResult(BaseModel):
    verified: bool
    distance: float
    threshold: float
    model: str


class ReservationMatchRequest(BaseModel):
    session_id: UUID
    full_name: str
    document_number: str | None = None
    date_of_birth: date | None = None


class ReservationMatchResult(BaseModel):
    matched: bool
    booking_id: int | None = None
    guest_id: int | None = None
    room_number: str | None = None
    room_type: str | None = None
    check_in_date: date | None = None
    check_out_date: date | None = None
    reason: str | None = None


class CheckinCompleteRequest(BaseModel):
    session_id: UUID
    guest_id: int
    booking_id: int


class CheckinCompleteResponse(BaseModel):
    status: str
    room_number: str | None = None
    message: str
