"use client";

import { useEffect, useRef, useState } from "react";
import { openVoiceStream } from "@/lib/websocket";

export default function VoiceAssistant() {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = openVoiceStream(
      (data) => {
        // Let openVoiceStream infer the callback parameter type.
        // We only use the fields needed by the UI.
        const event = data as Record<string, unknown>;

        // Do NOT render the complete Ultravox JSON response.
        // call_created means the backend successfully created the call.
        if (event.type === "call_created") {
          setConnected(true);
          return;
        }

        // Only show actual human-readable text/transcript messages.
        const text =
          typeof event.text === "string"
            ? event.text
            : typeof event.transcript === "string"
              ? event.transcript
              : typeof event.message === "string"
                ? event.message
                : undefined;

        if (text && text.trim()) {
          setTranscript((prev) => [...prev, text.trim()]);
        }
      },
      () => {
        setConnected(false);
      }
    );

    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);
    socket.onerror = () => setConnected(false);

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? "bg-green-500" : "bg-slate-300"
          }`}
        />
        <p className="text-sm font-medium">
          Voice assistant {connected ? "connected" : "connecting..."}
        </p>
      </div>

      {transcript.length > 0 && (
        <div className="max-h-40 space-y-1 overflow-y-auto text-xs text-slate-500">
          {transcript.map((line, i) => (
            <p key={`${i}-${line}`}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
