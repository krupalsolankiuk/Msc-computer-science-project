"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translation, getTranslation } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [t, setT] = useState<Translation>(getTranslation('en'));

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('hotel_checkin_language') as Language;
    if (saved) {
      setLanguageState(saved);
      setT(getTranslation(saved));
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setT(getTranslation(lang));
    localStorage.setItem('hotel_checkin_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
