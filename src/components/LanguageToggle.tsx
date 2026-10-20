import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();

  const setLang = (lng: 'en' | 'el') => {
    if (i18n.language !== lng) i18n.changeLanguage(lng);
  };

  return (
    <div className={className ? `${styles.toggle} ${className}` : styles.toggle}>
      <Globe size={15} strokeWidth={2} aria-hidden="true" />
      <button
        type="button"
        className={i18n.language === 'en' ? `${styles.option} ${styles.optionActive}` : styles.option}
        onClick={() => setLang('en')}
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
      <span className={styles.divider} aria-hidden="true">|</span>
      <button
        type="button"
        className={i18n.language === 'el' ? `${styles.option} ${styles.optionActive}` : styles.option}
        onClick={() => setLang('el')}
        aria-pressed={i18n.language === 'el'}
      >
        ΕΛ
      </button>
    </div>
  );
}
