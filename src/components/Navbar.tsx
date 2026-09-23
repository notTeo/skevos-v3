import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import CartButton from './CartButton';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.linkActive}` : styles.link;

  const productsClass = pathname.startsWith('/products') || pathname.startsWith('/product/')
    ? `${styles.link} ${styles.linkActive}`
    : styles.link;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
    } else {
      burgerRef.current?.focus();
    }
  }, [open]);

  return (
    <div className={styles.nav}>
      <img
        src="/assets/skevos-logo-nobg.png"
        alt="Skevos"
        className={styles.logo}
        onClick={() => navigate('/')}
      />

      <div className={styles.right}>
        <div className={styles.links}>
          <NavLink to="/" end className={linkClass}>{t('navbar.home')}</NavLink>
          <NavLink to="/products" className={productsClass}>{t('navbar.products')}</NavLink>
          <NavLink to="/about" className={linkClass}>{t('navbar.about')}</NavLink>
        </div>
        <LanguageToggle />
        <CartButton />
        <NavLink to="/contact" className={styles.contact}>{t('navbar.contact')}</NavLink>
      </div>

      <div className={styles.mobileRight}>
        <CartButton />
        <button
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-label={t('navbar.openMenu')}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen(true)}
        >
          <Menu size={26} strokeWidth={1.75} />
        </button>
      </div>

      <div
        className={open ? `${styles.backdrop} ${styles.backdropOpen}` : styles.backdrop}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-drawer"
        className={open ? `${styles.drawer} ${styles.drawerOpen}` : styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className={styles.drawerHeader}>
          <span className={styles.drawerHeading}>{t('navbar.menu')}</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            aria-label={t('navbar.closeMenu')}
            onClick={() => setOpen(false)}
          >
            <X size={26} strokeWidth={1.75} />
          </button>
        </div>
        <div className={styles.drawerLinks}>
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>{t('navbar.home')}</NavLink>
          <NavLink to="/products" className={productsClass} onClick={() => setOpen(false)}>{t('navbar.products')}</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>{t('navbar.about')}</NavLink>
          <NavLink to="/contact" className={styles.drawerContact} onClick={() => setOpen(false)}>{t('navbar.contact')}</NavLink>
        </div>
        <LanguageToggle className={styles.drawerLanguage} />
      </div>
    </div>
  );
}
