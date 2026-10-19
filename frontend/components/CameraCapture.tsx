"use client";

import { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  label?: string;
}

export default function CameraCapture({ onCapture, label = "Capture" }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    async function startCamera() {
      // Skip entirely if the browser has no camera API at all
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("No camera detected on this device.");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setReady(true);
        }
      } catch (err) {
        setCameraError(
          "No webcam found, or camera access was denied. You can upload a photo instead."
        );
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
      },
      "image/jpeg",
      0.92
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file (JPEG or PNG).");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onCapture(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!cameraError && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md rounded-lg border border-slate-300 bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          <button
            type="button"
            onClick={handleCapture}
            disabled={!ready}
            className="rounded-md bg-brand-accent px-4 py-2 text-white font-medium disabled:opacity-50"
          >
            {label}
          </button>
        </>
      )}

      {cameraError && (
        <div className="w-full max-w-md rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-amber-700 text-sm mb-3">{cameraError}</p>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected preview"
              className="mx-auto mb-3 max-h-48 rounded-md border border-slate-200"
            />
          )}
        </div>
      )}

      {/* Upload fallback is always available, even when the camera works,
          so it also covers kiosks/laptops with a camera the user still
          prefers not to use, or a flaky permission prompt. */}
      <div className="flex flex-col items-center gap-2">
        {!cameraError && <p className="text-xs text-slate-400">— or —</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {cameraError ? label + " — Upload Photo" : "Upload Photo Instead"}
        </button>
      </div>
    </div>
  );
}
