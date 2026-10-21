import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import styles from './About.module.css';

const STEPS = [
  { num: '01', key: 'quarried' },
  { num: '02', key: 'shaped' },
  { num: '03', key: 'polished' },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.hero} data-nav-hero>
        <img src="/assets/about/about-workshop.webp" className={styles.heroImg} alt="" />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>{t('about.heroTitle')}</h1>
        </div>
      </div>

      <section className={styles.body}>
        <div className={styles.bodyEyebrow}>{t('about.bodyEyebrow')}</div>
        <p className={styles.bodyText}>{t('about.bodyText1')}</p>
        <p className={styles.bodyText}>{t('about.bodyText2')}</p>
        <p className={styles.bodyText}>{t('about.bodyText3')}</p>
      </section>

      <section className={styles.process}>
        <h2 className={styles.processTitle}>{t('about.processTitle')}</h2>
        <ol className={styles.steps}>
          {STEPS.map((s) => (
            <li key={s.num} className={styles.step}>
              <div className={styles.stepNum} aria-hidden="true">{s.num}</div>
              <h3 className={styles.stepTitle}>{t(`about.steps.${s.key}.title`)}</h3>
              <p className={styles.stepDesc}>{t(`about.steps.${s.key}.desc`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.cta}>
        <Link to="/products" className={styles.primaryBtn}>{t('home.shopCollection')}</Link>
        <Link to="/contact" className={styles.textLink}>{t('home.requestPricing')} →</Link>
      </div>

      <Footer />
    </div>
  );
}
