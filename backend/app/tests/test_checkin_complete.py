from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app
from app.models.booking import Booking
from app.models.guest import Guest


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine)
    Base.metadata.create_all(engine)

    session = TestingSession()
    booking = Booking(
        guest_full_name="Jane Doe",
        check_in_date=date(2026, 10, 1),
        check_out_date=date(2026, 10, 5),
        room_number="204",
        status="CONFIRMED",
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)

    guest = Guest(booking_id=booking.booking_id, full_name="Jane Doe")
    session.add(guest)
    session.commit()
    session.refresh(guest)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        test_client.booking_id = booking.booking_id  # stash for the test
        test_client.guest_id = guest.guest_id
        yield test_client

    app.dependency_overrides.clear()


def test_complete_checkin_marks_booking_checked_in(client):
    resp = client.post(
        "/api/v1/checkin/complete",
        json={
            "session_id": "11111111-1111-1111-1111-111111111111",
            "guest_id": client.guest_id,
            "booking_id": client.booking_id,
        },
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "SUCCESS"


def test_second_complete_checkin_is_rejected(client):
    payload = {
        "session_id": "11111111-1111-1111-1111-111111111111",
        "guest_id": client.guest_id,
        "booking_id": client.booking_id,
    }
    first = client.post("/api/v1/checkin/complete", json=payload)
    assert first.status_code == 200

    second = client.post("/api/v1/checkin/complete", json=payload)
    assert second.status_code == 409
    assert "already" in second.json()["detail"].lower()
