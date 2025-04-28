"use client";

import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Spain from '../../locales/flags/es.webp';
import English from '../../locales/flags/en.webp';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "es" ? "en" : "es";
    changeLanguage(newLang);
  };

  return mounted ? (
    <button className="language-button" onClick={toggleLanguage} title={t('language')}>
      {language === "es"
        ? <Image src={Spain} alt="Spanish Flag" width={20} height={20} />
        : <Image src={English} alt="UK Flag" width={20} height={20} />}
    </button>
  ) : null;
};

export default LanguageSwitcher;