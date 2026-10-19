import httpx

from app.core.config import settings


class VoiceService:
    """Thin bridge to the Ultravox conversational voice API.

    The frontend opens a WebSocket to /api/v1/voice/stream (see
    routes_voice.py); this service is responsible for creating an Ultravox
    call session and relaying audio/events between the guest's browser and
    Ultravox's API.
    """

    async def create_call(self, system_prompt: str, language: str = "en") -> dict:
        headers = {"X-API-Key": settings.ULTRAVOX_API_KEY, "Content-Type": "application/json"}
        payload = {
            "systemPrompt": system_prompt,
            "languageHint": language,
            "medium": {"webRtc": {}},
        }
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(settings.ULTRAVOX_API_URL, json=payload, headers=headers)
            resp.raise_for_status()
            return resp.json()

    def default_system_prompt(self) -> str:
        return (
            "You are a friendly hotel check-in assistant. Greet the guest, "
            "explain the check-in steps (scan ID, take a photo, confirm "
            "booking), and answer questions about the process. Keep "
            "responses short and clear."
        )
