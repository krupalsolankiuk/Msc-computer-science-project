"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CheckinHeader from "@/components/CheckinHeader";
import LanguageSelector from "@/components/LanguageSelector";
import SimpleVoiceAssistant from "@/components/SimpleVoiceAssistant";
import { apiClient, OCRResult, ReservationMatchResult } from "@/lib/apiClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function ConfirmPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<ReservationMatchResult | null>(null);
  
  // Editable fields
  const [editingName, setEditingName] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    async function runMatch() {
      try {
        const sessionId = sessionStorage.getItem("session_id");
        const ocrDataRaw = sessionStorage.getItem("ocr_result");
        if (!sessionId || !ocrDataRaw) {
          throw new Error(t.errorSession);
        }
        const ocrData: OCRResult = JSON.parse(ocrDataRaw);

        const result = await apiClient.matchReservation({
          session_id: sessionId,
          full_name: ocrData.full_name ?? "",
          document_number: ocrData.document_number ?? undefined,
          date_of_birth: ocrData.date_of_birth ?? undefined,
        });

        setMatch(result);
        if (result.matched) {
          sessionStorage.setItem("reservation_match", JSON.stringify(result));
          setGuestName(ocrData.full_name ?? "");
          setCheckInDate(result.check_in_date ?? "");
          setCheckOutDate(result.check_out_date ?? "");
        }
      } catch (err) {
        setError(t.noReservation);
      } finally {
        setLoading(false);
      }
    }
    runMatch();
  }, [t]);

  const handleConfirm = async () => {
    if (!match?.matched || !match.guest_id || !match.booking_id) return;
    setConfirming(true);
    setError(null);
    try {
      const sessionId = sessionStorage.getItem("session_id");
      if (!sessionId) throw new Error("Missing session");
      
      // Update the match with edited values
      const updatedMatch = {
        ...match,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      };
      sessionStorage.setItem("reservation_match", JSON.stringify(updatedMatch));
      sessionStorage.setItem("edited_guest_name", guestName);
      
      await apiClient.completeCheckin({
        session_id: sessionId,
        guest_id: match.guest_id,
        booking_id: match.booking_id,
      });
      router.push("/checkin/complete");
    } catch (err) {
      setError("Could not finalise check-in. Please try again or ask staff for help.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <LanguageSelector />
        </div>
        <CheckinHeader activeStep="confirm" />
        <p className="text-center text-slate-500 text-sm">{t.lookingUp}</p>
      </div>
    );
  }

  if (error && !match) {
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <LanguageSelector />
        </div>
        <CheckinHeader activeStep="confirm" />
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 text-center space-y-3">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-xs text-slate-400">{t.contactStaff}</p>
        </div>
      </div>
    );
  }

  if (!match?.matched) {
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <LanguageSelector />
        </div>
        <CheckinHeader activeStep="confirm" />
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 text-center space-y-3">
          <p className="text-red-600 text-sm">{match?.reason}</p>
          <p className="text-xs text-slate-400">{t.contactStaff}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <LanguageSelector />
      </div>
      <CheckinHeader activeStep="confirm" />
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 text-center">{t.confirmTitle}</h2>
        
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-5 space-y-4 text-sm">
          {/* Guest Name - Editable */}
          <div>
            <label className="block text-slate-500 mb-1">{t.guestName}</label>
            {editingName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setEditingName(false)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-medium">{guestName}</span>
                <button
                  onClick={() => setEditingName(true)}
                  className="text-blue-600 hover:text-blue-700 text-xs underline"
                >
                  {t.editName}
                </button>
              </div>
            )}
          </div>

          {/* Room Number */}
          <div>
            <span className="text-slate-500">{t.room}</span> — <span className="font-medium">{match.room_number}</span>
          </div>

          {/* Room Type */}
          {match.room_type && (
            <div>
              <span className="text-slate-500">{t.roomType}</span> — <span className="font-medium">{match.room_type}</span>
            </div>
          )}

          {/* Check-in Date - Editable */}
          <div>
            <label className="block text-slate-500 mb-1">{t.checkIn}</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Check-out Date - Editable */}
          <div>
            <label className="block text-slate-500 mb-1">{t.checkOut}</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md py-2 px-3">{error}</p>
        )}
        
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full sm:w-auto rounded-md bg-brand-accent px-8 py-3 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {confirming ? t.finalising : t.confirmComplete}
        </button>
      </div>
      <div className="mt-4">
        <SimpleVoiceAssistant message={t.voiceConfirm} />
      </div>
    </div>
  );
}
