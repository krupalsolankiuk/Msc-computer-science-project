"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CameraCapture from "@/components/CameraCapture";
import CheckinHeader from "@/components/CheckinHeader";
import LanguageSelector from "@/components/LanguageSelector";
import SimpleVoiceAssistant from "@/components/SimpleVoiceAssistant";
import { apiClient, OCRResult } from "@/lib/apiClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function ScanPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const handleCapture = async (blob: Blob) => {
    setLoading(true);
    setError(null);
    try {
      const result: OCRResult = await apiClient.scanDocument(blob);
      sessionStorage.setItem("ocr_result", JSON.stringify(result));
      // Keep the document image (as a data URL) so the verify step can
      // compare it against the guest's live face capture.
      sessionStorage.setItem("document_image_blob", await blobToDataUrl(blob));
      router.push("/checkin/verify");
    } catch (err) {
      setError(t.scanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <LanguageSelector />
      </div>
      <CheckinHeader activeStep="scan" />
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">{t.scanTitle}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {t.scanInstruction}
          </p>
        </div>
        <CameraCapture onCapture={handleCapture} label={loading ? t.processing : t.scanDocument} />
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-100 rounded-md py-2 px-3">
            {error}
          </p>
        )}
      </div>
      <div className="mt-4">
        <SimpleVoiceAssistant message={t.voiceScan} />
      </div>
    </div>
  );
}
