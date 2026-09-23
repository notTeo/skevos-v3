import { useTranslation } from 'react-i18next';
import { Camera, Pin } from 'lucide-react';
import styles from './Footer.module.css';

interface FooterProps {
  topPadding?: string;
}

export default function Footer({ topPadding }: FooterProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrap} style={topPadding ? { paddingTop: topPadding } : undefined}>
      <div className={styles.inner}>
        <div>{t('footer.copyright')}</div>
        <div className={styles.social}>
          <a href="#" className={styles.socialLink} aria-label={t('footer.instagram')}>
            <Camera size={16} strokeWidth={1.75} />
            <span>{t('footer.instagram')}</span>
          </a>
          <a href="#" className={styles.socialLink} aria-label={t('footer.pinterest')}>
            <Pin size={16} strokeWidth={1.75} />
            <span>{t('footer.pinterest')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
