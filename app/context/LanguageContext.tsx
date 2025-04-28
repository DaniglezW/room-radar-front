'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import esTranslation from '../locales/es.json';
import enTranslation from '../locales/en.json';
import i18n from '../locales/i18n';

interface LanguageContextType {
  language: string;
  resources: {
    es: { translation: typeof esTranslation };
    en: { translation: typeof enTranslation };
  };
  changeLanguage: (newLanguage: string) => void;
  isTransitioning: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const resources = {
    es: { translation: esTranslation },
    en: { translation: enTranslation },
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      localStorage.setItem('appLanguage', 'en');
      setLanguage('en');
      i18n.changeLanguage('en');
    }
  }, []);

  const changeLanguage = (newLanguage: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage(newLanguage);
      localStorage.setItem('appLanguage', newLanguage);
      i18n.changeLanguage(newLanguage);
      setIsTransitioning(false);
    }, 500);
  };

  const currentLanguage = language ?? 'en';

  const contextValue = useMemo(
    () => ({
      language: currentLanguage,
      resources,
      changeLanguage,
      isTransitioning,
    }),
    [currentLanguage, resources, changeLanguage, isTransitioning]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      <div className={isTransitioning ? 'fade-out' : 'fade-in'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};