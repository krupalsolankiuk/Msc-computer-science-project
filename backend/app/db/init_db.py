from app.db.session import Base, engine
from app.models import booking, guest, verification_log  # noqa: F401 (register models)


def init_db() -> None:
    """Create all tables if they do not already exist.

    In production, prefer Alembic migrations (see /backend/alembic). This
    helper is convenient for local development and first-run bootstrap.
    """
    Base.metadata.create_all(bind=engine)
