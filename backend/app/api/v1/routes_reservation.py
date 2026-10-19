from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.checkin import ReservationMatchRequest, ReservationMatchResult
from app.services.matching_service import MatchingService

router = APIRouter(prefix="/reservation", tags=["reservation"])
matching_service = MatchingService()


@router.post("/match", response_model=ReservationMatchResult)
def match_reservation(payload: ReservationMatchRequest, db: Session = Depends(get_db)):
    result = matching_service.find_matching_booking(
        db=db,
        full_name=payload.full_name,
        document_number=payload.document_number,
        date_of_birth=payload.date_of_birth,
    )
    return ReservationMatchResult(**result)
