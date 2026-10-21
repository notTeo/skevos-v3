import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Camera, ChevronDown, Mail, Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import CartButton from './CartButton';
import { THEME_SWITCHING_ENABLED } from '../context/ThemeContext';
import { CATEGORIES } from '../data/products';
import styles from './Navbar.module.css';
import { lockScroll } from '../lib/scrollLock';

const LOGO_SRC = '/assets/logo/skevos-wordmark.png';

const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

// "Home Objects" → "Home objects": the drawer's sub-links read as sentence case in both languages
const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.linkActive}` : styles.link;

  const productsActive = pathname.startsWith('/products') || pathname.startsWith('/product/');
  const productsClass = productsActive ? `${styles.link} ${styles.linkActive}` : styles.link;

  const close = () => setOpen(false);

  // pages that open with a dark hero: the bar sits on top of it while transparent
  const hasHero = pathname === '/' || pathname === '/about';
  const navClass = [styles.nav, atTop && styles.navTop, hasHero && styles.navOverlay, hasHero && atTop && styles.navOverHero]
    .filter(Boolean)
    .join(' ');

  // on hero pages the bar stays clear until the hero has scrolled up past it
  useEffect(() => {
    const onScroll = () => {
      const hero = hasHero ? document.querySelector('[data-nav-hero]') : null;
      const navH = navRef.current?.offsetHeight ?? 0;
      setAtTop(hero ? hero.getBoundingClientRect().bottom > navH : window.scrollY < 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname, hasHero]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) return lockScroll();
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
    } else if (wasOpen.current) {
      burgerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  return (
    <div className={navClass} ref={navRef}>
      <Link to="/" className={styles.logoLink} aria-label="Skevos">
        <img src={LOGO_SRC} alt="Skevos" className={styles.logo} />
      </Link>

      <div className={`${styles.right} ${styles.bar}`}>
        <div className={styles.links}>
          <NavLink to="/products" className={productsClass}>{t('navbar.products')}</NavLink>
          <NavLink to="/materials" className={linkClass}>{t('navbar.materials')}</NavLink>
          <NavLink to="/about" className={linkClass}>{t('navbar.about')}</NavLink>
        </div>
        <LanguageToggle />
        {THEME_SWITCHING_ENABLED && <ThemeToggle />}
        <CartButton />
        <NavLink to="/contact" className={styles.contact}>{t('navbar.contact')}</NavLink>
      </div>

      <div className={`${styles.mobileRight} ${styles.bar}`}>
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

      <div className={styles.layer}>
        <div
          className={open ? `${styles.backdrop} ${styles.backdropOpen}` : styles.backdrop}
          onClick={close}
          aria-hidden="true"
        />

        <div
          id="mobile-drawer"
          className={open ? `${styles.drawer} ${styles.drawerOpen}` : styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-label={t('navbar.menu')}
          inert={!open}
        >
          <div className={styles.drawerHeader}>
            <Link to="/" className={styles.logoLink} aria-label="Skevos" onClick={close}>
              <img src={LOGO_SRC} alt="Skevos" className={styles.drawerLogo} />
            </Link>
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              aria-label={t('navbar.closeMenu')}
              onClick={close}
            >
              <X size={22} strokeWidth={1.75} />
            </button>
          </div>

          <nav className={styles.drawerNav}>
            <div className={styles.drawerItem} style={stagger(0)}>
              <div className={styles.drawerRow}>
                <Link
                  to="/products"
                  className={styles.drawerLink}
                  aria-current={productsActive ? 'true' : undefined}
                  onClick={close}
                >
                  {t('navbar.products')}
                </Link>
                <button
                  type="button"
                  className={showCategories ? `${styles.expandBtn} ${styles.expandBtnOpen}` : styles.expandBtn}
                  aria-label={t('navbar.showCategories')}
                  aria-expanded={showCategories}
                  aria-controls="drawer-categories"
                  onClick={() => setShowCategories((v) => !v)}
                >
                  <ChevronDown size={22} strokeWidth={1.75} />
                </button>
              </div>
              <div
                id="drawer-categories"
                className={showCategories ? `${styles.subLinks} ${styles.subLinksOpen}` : styles.subLinks}
                inert={!showCategories}
              >
                <div className={styles.subLinksInner}>
                  <NavLink to="/products" end className={styles.subLink} onClick={close}>
                    {sentenceCase(t('navbar.allProducts'))}
                  </NavLink>
                  {CATEGORIES.map((category) => (
                    <NavLink key={category.id} to={`/products/${category.id}`} className={styles.subLink} onClick={close}>
                      {sentenceCase(t(`products.categories.${category.id}`, { defaultValue: category.name }))}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.drawerItem} style={stagger(1)}>
              <NavLink to="/materials" className={styles.drawerLink} onClick={close}>{t('navbar.materials')}</NavLink>
            </div>
            <div className={styles.drawerItem} style={stagger(2)}>
              <NavLink to="/about" className={styles.drawerLink} onClick={close}>{t('navbar.about')}</NavLink>
            </div>
          </nav>

          <div className={styles.drawerFooter} style={stagger(3)}>
            <NavLink to="/contact" className={styles.drawerContact} onClick={close}>
              {t('navbar.contact')}
              <ArrowRight size={16} strokeWidth={2} />
            </NavLink>

            <div className={styles.drawerMeta}>
              <div className={styles.social}>
                <a href="#" className={styles.iconLink} aria-label={t('footer.instagram')}>
                  <Camera size={20} strokeWidth={1.75} aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${t('contact.panelEmailValue')}`}
                  className={styles.iconLink}
                  aria-label={t('navbar.emailLabel', { email: t('contact.panelEmailValue') })}
                >
                  <Mail size={20} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </div>
              <div className={styles.prefs}>
                {THEME_SWITCHING_ENABLED && <ThemeToggle className={styles.prefToggle} />}
                <LanguageToggle className={styles.drawerLang} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
