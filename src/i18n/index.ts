import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import el from '../locales/el.json';

export const LANGUAGE_STORAGE_KEY = 'skevos-lang';

function getInitialLanguage(): 'en' | 'el' {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'el') return stored;
  } catch {
    // localStorage unavailable (private mode, disabled storage) — fall back below
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    el: { translation: el },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
