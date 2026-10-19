const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API error ${res.status}: ${detail}`);
  }

  return res.json() as Promise<T>;
}

export interface SessionResponse {
  session_id: string;
  token: string;
}

export interface OCRResult {
  full_name: string | null;
  date_of_birth: string | null;
  document_type: string | null;
  document_number: string | null;
  nationality: string | null;
  confidence: number | null;
  raw_text: string;
}

export interface FaceVerifyResult {
  verified: boolean;
  distance: number;
  threshold: number;
  model: string;
}

export interface ReservationMatchResult {
  matched: boolean;
  booking_id: number | null;
  guest_id: number | null;
  room_number: string | null;
  room_type: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  reason: string | null;
}

export const apiClient = {
  startSession: () =>
    request<SessionResponse>("/api/v1/checkin/session", { method: "POST" }),

  scanDocument: (image: Blob) => {
    const formData = new FormData();
    formData.append("image", image, "document.jpg");
    return request<OCRResult>("/api/v1/ocr/scan", { method: "POST", body: formData });
  },

  verifyFace: (liveImage: Blob, documentImage: Blob) => {
    const formData = new FormData();
    formData.append("live_image", liveImage, "live.jpg");
    formData.append("document_image", documentImage, "document.jpg");
    return request<FaceVerifyResult>("/api/v1/face/verify", { method: "POST", body: formData });
  },

  matchReservation: (payload: {
    session_id: string;
    full_name: string;
    document_number?: string;
    date_of_birth?: string;
  }) =>
    request<ReservationMatchResult>("/api/v1/reservation/match", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  completeCheckin: (payload: { session_id: string; guest_id: number; booking_id: number }) =>
    request("/api/v1/checkin/complete", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
