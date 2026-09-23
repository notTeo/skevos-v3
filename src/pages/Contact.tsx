import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import styles from './Contact.module.css';

const REASONS = ['Retail', 'Wholesale', 'Press'];

export default function Contact() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Retail');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setSent(true);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('contact.eyebrow')}</div>
        <div className={styles.title}>{t('contact.title')}</div>
        <div className={styles.desc}>{t('contact.desc')}</div>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <div className={styles.label}>{t('contact.nameLabel')}</div>
              <input
                className={styles.input}
                placeholder={t('contact.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <div className={styles.label}>{t('contact.emailLabel')}</div>
              <input
                className={styles.input}
                placeholder={t('contact.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className={styles.label}>{t('contact.reasonLabel')}</div>
            <div className={styles.chips}>
              {REASONS.map((r) => (
                <div
                  key={r}
                  className={reason === r ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                  onClick={() => setReason(r)}
                >
                  {t(`contact.reasons.${r}`)}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.label}>{t('contact.messageLabel')}</div>
            <textarea
              className={styles.textarea}
              placeholder={t('contact.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className={styles.submitBtn} onClick={handleSubmit}>
            {sent ? t('contact.sentConfirmation') : t('contact.sendMessage')}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>{t('contact.panelTitle')}</div>
          <div className={styles.panelBlock}>
            <div className={styles.panelLabel}>{t('contact.panelEmailLabel')}</div>
            <div className={styles.panelValue}>{t('contact.panelEmailValue')}</div>
          </div>
          <div className={styles.panelBlock}>
            <div className={styles.panelLabel}>{t('contact.panelWorkshopLabel')}</div>
            <div className={styles.panelValue}>{t('contact.panelWorkshopValue')}</div>
          </div>
          <div>
            <div className={styles.panelLabel}>{t('contact.panelWholesaleLabel')}</div>
            <div className={styles.panelDesc}>{t('contact.panelWholesaleDesc')}</div>
          </div>
        </div>
      </div>

      <Footer topPadding="0" />
    </div>
  );
}
