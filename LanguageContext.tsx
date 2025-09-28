import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in translations) {
    return browserLang as Language;
  }
  return 'en';
};

const getLocaleForLanguage = (lang: Language): string => {
    switch(lang) {
        case 'en': return 'en-US';
        case 'hi': return 'hi-IN';
        case 'mr': return 'mr-IN';
        case 'ta': return 'ta-IN';
        case 'te': return 'te-IN';
        case 'ml': return 'ml-IN';
        case 'ur': return 'ur-IN';
        case 'sa': return 'sa-IN';
        default: return 'en-US';
    }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage());

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    return translations[language]?.[key] || translations['en'][key] || fallback || String(key);
  }, [language]);

  const locale = getLocaleForLanguage(language);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
