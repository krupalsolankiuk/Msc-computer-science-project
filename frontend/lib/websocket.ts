const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export function openVoiceStream(
  onMessage: (data: unknown) => void,
  onError?: (err: Event) => void
): WebSocket {
  const socket = new WebSocket(`${WS_BASE_URL}/api/v1/voice/stream`);

  socket.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch {
      onMessage(event.data);
    }
  };

  socket.onerror = (err) => {
    if (onError) onError(err);
  };

  return socket;
}
