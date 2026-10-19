"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CheckinHeader from "@/components/CheckinHeader";
import LanguageSelector from "@/components/LanguageSelector";
import SimpleVoiceAssistant from "@/components/SimpleVoiceAssistant";
import { apiClient } from "@/lib/apiClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await apiClient.startSession();
      sessionStorage.setItem("session_id", session.session_id);
      sessionStorage.setItem("session_token", session.token);
      router.push("/checkin/scan");
    } catch (err) {
      setError(t.errorStart);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <LanguageSelector />
      </div>
      <CheckinHeader activeStep="start" />
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-8 text-center space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{t.welcome}</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Scan your ID, confirm your identity, and check in — no front desk
            queue required.
          </p>
        </div>
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md py-2 px-3">
            {error}
          </p>
        )}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full sm:w-auto rounded-md bg-brand-accent px-8 py-3 text-white font-medium shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? t.starting : t.startCheckin}
        </button>
      </div>
      <div className="mt-6">
        <SimpleVoiceAssistant message={t.voiceWelcome} autoPlay={false} />
      </div>
    </div>
  );
}
