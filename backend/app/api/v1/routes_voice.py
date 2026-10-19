from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.voice_service import VoiceService

router = APIRouter(prefix="/voice", tags=["voice"])
voice_service = VoiceService()


@router.websocket("/stream")
async def voice_stream(websocket: WebSocket):
    """Bridges the guest's browser audio stream to the Ultravox voice agent.

    This is a simplified relay: in production you would forward the
    negotiated WebRTC/audio session details from create_call() to the
    client and proxy binary audio frames both ways. Kept minimal here so
    it's easy to extend and test.
    
    NOTE: Ultravox API requires payment. This endpoint is kept for future use
    but will gracefully handle API errors.
    """
    await websocket.accept()
    try:
        try:
            call_info = await voice_service.create_call(voice_service.default_system_prompt())
            await websocket.send_json({"type": "call_created", "data": call_info})
        except Exception as e:
            # Ultravox API may require payment or be unavailable
            # Send error message but keep connection open for future use
            await websocket.send_json({
                "type": "error",
                "message": "Voice assistant unavailable. Text-to-speech is available in the UI."
            })
            # Close gracefully
            await websocket.close()
            return

        while True:
            message = await websocket.receive()
            if message.get("type") == "websocket.disconnect":
                break
            # Relay audio/text frames to/from Ultravox here.
            await websocket.send_json({"type": "ack"})
    except WebSocketDisconnect:
        pass
