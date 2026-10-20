import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, Mail, MapPin } from 'lucide-react';
import { CATEGORIES, getProductsByCategory } from '../data/products';
import styles from './Footer.module.css';

const LOGO_SRC = '/assets/logo/skevos-wordmark.png';

interface FooterProps {
  // space between the page content and the footer
  topPadding?: string;
}

export default function Footer({ topPadding }: FooterProps) {
  const { t } = useTranslation();
  const email = t('contact.panelEmailValue');
  const categories = CATEGORIES.filter((c) => getProductsByCategory(c.id).length > 0);

  return (
    <footer className={styles.wrap} style={topPadding ? { marginTop: topPadding } : undefined}>
      <div className={styles.columns}>
        <div className={styles.brand}>
          <Link to="/" aria-label="Skevos">
            <img src={LOGO_SRC} alt="Skevos" className={styles.logo} />
          </Link>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
        </div>

        <nav className={styles.col} aria-label={t('footer.shop')}>
          <div className={styles.colTitle}>{t('footer.shop')}</div>
          <Link to="/products" className={styles.link}>{t('navbar.allProducts')}</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/products/${c.id}`} className={styles.link}>
              {t(`products.categories.${c.id}`, { defaultValue: c.name })}
            </Link>
          ))}
          <Link to="/materials" className={styles.link}>{t('navbar.materials')}</Link>
        </nav>

        <nav className={styles.col} aria-label={t('footer.company')}>
          <div className={styles.colTitle}>{t('footer.company')}</div>
          <Link to="/about" className={styles.link}>{t('navbar.about')}</Link>
          <Link to="/contact" className={styles.link}>{t('navbar.contact')}</Link>
        </nav>

        <div className={styles.col}>
          <div className={styles.colTitle}>{t('footer.getInTouch')}</div>
          <a href={`mailto:${email}`} className={styles.link}>
            <Mail size={15} strokeWidth={1.75} aria-hidden="true" />
            {email}
          </a>
          <a href="#" className={styles.link}>
            <Camera size={15} strokeWidth={1.75} aria-hidden="true" />
            {t('footer.instagram')}
          </a>
          <span className={styles.plain}>
            <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />
            {t('footer.madeIn')}
          </span>
        </div>
      </div>

      <div className={styles.bottom}>
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
