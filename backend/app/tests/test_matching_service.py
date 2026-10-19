from datetime import date

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.session import Base
from app.models.booking import Booking
from app.models.guest import Guest  # noqa: F401 (needed to resolve Booking.guests relationship)
from app.models.verification_log import VerificationLog  # noqa: F401
from app.services.matching_service import MatchingService


@pytest.fixture()
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    session.add(
        Booking(
            guest_full_name="Jane Doe",
            passport_no="X1234567",
            check_in_date=date(2026, 10, 1),
            check_out_date=date(2026, 10, 5),
            room_number="204",
            status="CONFIRMED",
        )
    )
    session.commit()
    yield session
    session.close()


def test_match_by_exact_name(db_session):
    service = MatchingService()
    result = service.find_matching_booking(db_session, full_name="Jane Doe")
    assert result["matched"] is True
    assert result["room_number"] == "204"
    assert result["guest_id"] is not None

    persisted = db_session.query(Guest).filter(Guest.guest_id == result["guest_id"]).first()
    assert persisted is not None
    assert persisted.full_name == "Jane Doe"
    assert persisted.booking_id == result["booking_id"]


def test_match_case_insensitive(db_session):
    service = MatchingService()
    result = service.find_matching_booking(db_session, full_name="jane doe")
    assert result["matched"] is True


def test_match_by_document_number_fallback(db_session):
    service = MatchingService()
    result = service.find_matching_booking(
        db_session, full_name="Unknown Name", document_number="X1234567"
    )
    assert result["matched"] is True
    assert result["booking_id"] == 1


def test_no_match_found(db_session):
    service = MatchingService()
    result = service.find_matching_booking(db_session, full_name="Nobody Here")
    assert result["matched"] is False
    assert result["reason"] is not None


def test_repeated_match_reuses_same_guest_row_not_duplicates(db_session):
    # Regression test: previously every call created a brand-new Guest
    # row, so retrying/going back a step during check-in produced
    # duplicate rows for the same person (observed in testing).
    service = MatchingService()

    first = service.find_matching_booking(db_session, full_name="Jane Doe")
    second = service.find_matching_booking(db_session, full_name="Jane Doe")

    assert first["guest_id"] == second["guest_id"]
    assert db_session.query(Guest).count() == 1


def test_already_checked_in_booking_cannot_be_matched_again(db_session):
    # Regression test: nothing previously stopped the same guest from
    # "checking in" repeatedly. Once a booking's status is CHECKED_IN,
    # matching must refuse and explain why.
    service = MatchingService()

    booking = db_session.query(Booking).filter(Booking.guest_full_name == "Jane Doe").first()
    booking.status = "CHECKED_IN"
    db_session.commit()

    result = service.find_matching_booking(db_session, full_name="Jane Doe")
    assert result["matched"] is False
    assert "already been checked in" in result["reason"]
