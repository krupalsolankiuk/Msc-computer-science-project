import uuid
from datetime import datetime, timedelta, timezone

from jose import jwt

from app.core.config import settings

ALGORITHM = "HS256"


def new_session_id() -> str:
    """Generate a unique identifier for a guest check-in session."""
    return str(uuid.uuid4())


def create_session_token(session_id: str) -> str:
    """Create a short-lived JWT that ties the browser session to a session_id."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.SESSION_EXPIRE_MINUTES)
    payload = {"sub": session_id, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_session_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        return None
