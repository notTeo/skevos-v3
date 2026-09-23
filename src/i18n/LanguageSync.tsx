import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from './index';

export default function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const applyLanguage = (lng: string) => {
      document.documentElement.lang = lng;
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
      } catch {
        // localStorage unavailable — language still works for this session
      }
    };

    applyLanguage(i18n.language);
    i18n.on('languageChanged', applyLanguage);
    return () => {
      i18n.off('languageChanged', applyLanguage);
    };
  }, [i18n]);

  return null;
}
