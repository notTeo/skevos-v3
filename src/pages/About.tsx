import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import styles from './About.module.css';

const STEPS = [
  { num: '01', key: 'quarried' },
  { num: '02', key: 'shaped' },
  { num: '03', key: 'polished' },
];

const GALLERY = [
  '/assets/products/spoon-rest/spoon-nero-greco-angle.webp',
  '/assets/products/spoon-rest/spoon-rodiths-angle.webp',
  '/assets/products/spoon-rest/spoon-maroko-sand-angle.webp',
  '/assets/products/spoon-rest/spoon-foume-angle.webp',
];

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.hero} data-nav-hero>
        <img src="/assets/about/about-workshop.webp" className={styles.heroImg} alt="" />
        <div className={styles.heroOverlay}>
          <div className={styles.heroTitle}>{t('about.heroTitle')}</div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.bodyEyebrow}>{t('about.bodyEyebrow')}</div>
        <div className={styles.bodyText}>{t('about.bodyText1')}</div>
        <div className={styles.bodyText}>{t('about.bodyText2')}</div>
        <div className={styles.bodyTextLast}>{t('about.bodyText3')}</div>
      </div>

      <div className={styles.process}>
        <div className={styles.processTitle}>{t('about.processTitle')}</div>
        <div className={styles.steps}>
          {STEPS.map((s) => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepTitle}>{t(`about.steps.${s.key}.title`)}</div>
              <div className={styles.stepDesc}>{t(`about.steps.${s.key}.desc`)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.gallery}>
        {GALLERY.map((src) => (
          <div key={src} className={styles.galleryItem}>
            <img src={src} className={styles.galleryImg} alt="" />
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
