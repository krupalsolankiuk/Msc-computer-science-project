"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CameraCapture from "@/components/CameraCapture";
import CheckinHeader from "@/components/CheckinHeader";
import LanguageSelector from "@/components/LanguageSelector";
import SimpleVoiceAssistant from "@/components/SimpleVoiceAssistant";
import { apiClient } from "@/lib/apiClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function VerifyPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (liveBlob: Blob) => {
    setLoading(true);
    setError(null);
    try {
      const docBlobData = sessionStorage.getItem("document_image_blob");
      if (!docBlobData) {
        throw new Error("Missing document image — please rescan your ID.");
      }
      const documentBlob = await (await fetch(docBlobData)).blob();

      const result = await apiClient.verifyFace(liveBlob, documentBlob);

      if (!result.verified) {
        setError(t.verifyError);
        return;
      }

      sessionStorage.setItem("face_verify_result", JSON.stringify(result));
      router.push("/checkin/confirm");
    } catch (err) {
      setError("Face verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <LanguageSelector />
      </div>
      <CheckinHeader activeStep="verify" />
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">{t.verifyTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {t.verifyInstruction}
          </p>
        </div>
        <CameraCapture onCapture={handleCapture} label={loading ? t.verifying : t.takePhoto} />
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-md py-2 px-3">
            {error}
          </p>
        )}
      </div>
      <div className="mt-4">
        <SimpleVoiceAssistant message={t.voiceVerify} />
      </div>
    </div>
  );
}
