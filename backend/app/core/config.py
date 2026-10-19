from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables / .env file."""

    PROJECT_NAME: str = "AI-Powered Hotel Guest Check-In Assistant"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql://checkin_admin:changeme@db:5432/hotel_checkin"

    ULTRAVOX_API_KEY: str = ""
    ULTRAVOX_API_URL: str = "https://api.ultravox.ai/api/calls"

    TESSERACT_CMD: str = "/usr/bin/tesseract"
    FACE_MATCH_THRESHOLD: float = 0.40
    FACE_MODEL_NAME: str = "Facenet512"
    FACE_DETECTOR_BACKEND: str = "retinaface"

    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    SECRET_KEY: str = "change-this-in-production"
    SESSION_EXPIRE_MINUTES: int = 30

    UPLOAD_DIR: str = "/app/uploads"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
