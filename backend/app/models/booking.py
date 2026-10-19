from datetime import date

from sqlalchemy import Date, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Booking(Base):
    __tablename__ = "bookings"

    booking_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    guest_full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    passport_no: Mapped[str | None] = mapped_column(String(50), nullable=True)
    check_in_date: Mapped[date] = mapped_column(Date, nullable=False)
    check_out_date: Mapped[date] = mapped_column(Date, nullable=False)
    room_number: Mapped[str | None] = mapped_column(String(10), nullable=True)
    room_type: Mapped[str] = mapped_column(String(50), default="Standard Room")
    status: Mapped[str] = mapped_column(String(20), default="CONFIRMED")

    guests = relationship("Guest", back_populates="booking")
