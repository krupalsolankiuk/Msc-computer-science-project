import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.session import Base


class VerificationLog(Base):
    __tablename__ = "verification_logs"

    log_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    guest_id: Mapped[int | None] = mapped_column(ForeignKey("guests.guest_id"), nullable=True)
    session_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    face_match_score: Mapped[float | None] = mapped_column(Numeric(6, 4), nullable=True)
    face_verified: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    ocr_raw_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    voice_transcript: Mapped[str | None] = mapped_column(Text, nullable=True)
    result: Mapped[str | None] = mapped_column(String(20), nullable=True)  # SUCCESS/FAILED/MANUAL_REVIEW
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    guest = relationship("Guest", back_populates="verification_logs")
