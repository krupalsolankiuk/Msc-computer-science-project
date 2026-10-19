"use client";

import { useEffect, useState } from "react";

import CheckinHeader from "@/components/CheckinHeader";
import LanguageSelector from "@/components/LanguageSelector";
import SimpleVoiceAssistant from "@/components/SimpleVoiceAssistant";
import { ReservationMatchResult } from "@/lib/apiClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function CompletePage() {
  const { t } = useLanguage();
  const [match, setMatch] = useState<ReservationMatchResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("reservation_match");
    if (raw) setMatch(JSON.parse(raw));
  }, []);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <LanguageSelector />
      </div>
      <CheckinHeader activeStep="complete" />
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
          ✓
        </div>
        <h2 className="text-xl font-semibold text-green-700">{t.checkedIn}</h2>
        {match?.room_number && (
          <p className="text-slate-700 text-sm">
            {t.yourRoom} <span className="font-semibold">{match.room_number}</span>. {t.enjoyStay}
          </p>
        )}
        <p className="text-xs text-slate-400">
          {t.digitalKey}
        </p>
      </div>
      <div className="mt-4">
        <SimpleVoiceAssistant message={t.voiceSuccess} />
      </div>
    </div>
  );
}
