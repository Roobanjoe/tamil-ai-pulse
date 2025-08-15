import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ta' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isDetectingLanguage: boolean;
  detectLanguage: (text: string) => Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ta');
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem('aiadmk-language') as Language;
    if (savedLang && ['ta', 'en'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('aiadmk-language', lang);
  };

  // Tamil Unicode range detection
  const detectLanguage = (text: string): Language => {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    return tamilRegex.test(text) ? 'ta' : 'en';
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    isDetectingLanguage,
    detectLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}