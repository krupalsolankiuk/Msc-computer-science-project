"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface SimpleVoiceAssistantProps {
  message: string;
  autoPlay?: boolean;
}

export default function SimpleVoiceAssistant({ message, autoPlay = true }: SimpleVoiceAssistantProps) {
  const { language } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const speak = () => {
    if (!supported || !message) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    
    // Map language codes to speech synthesis language codes
    const langMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      zh: 'zh-CN',
      ko: 'ko-KR',
      ja: 'ja-JP',
      de: 'de-DE',
      es: 'es-ES',
      fr: 'fr-FR',
    };
    
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoPlay && supported && message) {
      // Delay to ensure message is ready
      const timer = setTimeout(() => {
        speak();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [message, autoPlay, supported, language]);

  if (!supported) return null;

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${speaking ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
          <div>
            <p className="text-sm font-medium text-slate-900">Voice Assistant</p>
            <p className="text-xs text-slate-600 mt-0.5">{message}</p>
          </div>
        </div>
        <button
          onClick={speak}
          disabled={speaking}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {speaking ? '🔊 Speaking...' : '🔊 Play'}
        </button>
      </div>
    </div>
  );
}
