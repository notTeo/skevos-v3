import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import {
  CATEGORIES, MATERIALS, getFeaturedItems, getProductsByCategory, swatchBackground,
} from '../data/products';
import styles from './Home.module.css';

const FEATURED_ITEMS = getFeaturedItems();
const STRIP_SPEED = 18; // px per second

// Auto-scrolls the stone strip in an endless loop. Pauses while hovered, focused or touched;
// the mouse wheel scrolls it sideways. Its content is rendered twice, so jumping back by half
// its width is invisible.
function useAutoScroll(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pos = el.scrollLeft;
    let paused = false;
    let resumeTimer = 0;
    let last = performance.now();
    let frame = 0;

    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0) el.scrollLeft += half;
      pos = el.scrollLeft;
    };
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!paused && !reduceMotion) {
        pos += STRIP_SPEED * dt;
        if (pos >= el.scrollWidth / 2) pos -= el.scrollWidth / 2;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(tick);
    };
    const pause = () => { paused = true; clearTimeout(resumeTimer); };
    const resumeLater = (ms: number) => {
      clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => { paused = false; }, ms);
    };
    const onScroll = () => {
      // keep our position in sync when the visitor scrolled it themselves
      if (Math.abs(el.scrollLeft - pos) > 1) wrap();
    };
    const onWheel = (e: WheelEvent) => {
      // trackpads already scroll sideways; turn a plain vertical wheel into sideways movement
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    const onLeave = () => resumeLater(0);
    const onTouchEnd = () => resumeLater(2500);

    el.scrollLeft = 1;
    pos = 1;
    frame = requestAnimationFrame(tick);
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', onLeave);
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', onLeave);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [ref]);
}

export default function Home() {
  const { t } = useTranslation();
  const stripRef = useRef<HTMLDivElement>(null);
  useAutoScroll(stripRef);
  // only categories that already have pieces
  const categories = CATEGORIES.filter((c) => c.image && getProductsByCategory(c.id).length > 0);

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.eyebrow}>{t('home.eyebrow')}</div>
          <h1 className={styles.heroTitle}>
            {t('home.heroTitleLine1')}<br />{t('home.heroTitleLine2')}<br />{t('home.heroTitleLine3')}
          </h1>
          <p className={styles.heroDesc}>{t('home.heroDesc')}</p>
          <div className={styles.heroActions}>
            <Link to="/products" className={styles.primaryBtn}>{t('home.shopCollection')}</Link>
            <Link to="/contact" className={styles.textLink}>{t('home.requestPricing')} →</Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{t('home.categoriesTitle')}</h2>
        </div>
        <div className={styles.categories}>
          {categories.map((category) => {
            const name = t(`products.categories.${category.id}`, { defaultValue: category.name });
            return (
              <Link key={category.id} to={`/products/${category.id}`} className={styles.categoryCard}>
                <img src={category.image!} className={styles.cover} alt="" />
                <div className={styles.categoryLabel}>
                  <span className={styles.categoryName}>{name}</span>
                  <span className={styles.categoryMeta}>
                    {t('products.pieceCount', { count: getProductsByCategory(category.id).length })} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.sectionEyebrow}>{t('home.introEyebrow')}</div>
            <h2 className={styles.sectionTitle}>{t('home.introTitle')}</h2>
          </div>
          <Link to="/products" className={styles.headLink}>{t('home.viewAll')} →</Link>
        </div>
        <div className={styles.grid}>
          {FEATURED_ITEMS.map((item) => {
            const finishName = t(`catalog.finishes.${item.finish.id}`, { defaultValue: item.finish.name });
            const productName = t(`catalog.products.${item.productId}.name`, { defaultValue: item.productName });
            return (
              <Link
                key={`${item.productId}-${item.finishIndex}`}
                to={`/product/${item.productId}/${item.finishIndex}`}
                className={styles.gridItem}
              >
                <div className={styles.gridImgWrap}>
                  <img src={item.finish.img} className={styles.cover} alt={`${productName} — ${finishName}`} loading="lazy" />
                </div>
                <div className={styles.gridName}>{productName}</div>
                <div className={styles.gridFinish}>
                  <span className={styles.swatch} style={{ background: swatchBackground(item.finish) }} />
                  {finishName}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.sectionEyebrow}>{t('materials.eyebrow')}</div>
            <h2 className={styles.sectionTitle}>{t('home.materialsTitle', { count: MATERIALS.length })}</h2>
          </div>
          <Link to="/materials" className={styles.headLink}>{t('home.materialsLink')} →</Link>
        </div>
        {/* the list is rendered twice so the loop wraps seamlessly */}
        <div className={styles.strip} ref={stripRef}>
          <div className={styles.track}>
            {[...MATERIALS, ...MATERIALS].map((finish, i) => {
              const name = t(`catalog.finishes.${finish.id}`, { defaultValue: finish.name });
              const copy = i >= MATERIALS.length;
              return (
                <Link
                  key={`${finish.id}-${i}`}
                  to={`/materials#${finish.id}`}
                  className={styles.stripItem}
                  aria-hidden={copy || undefined}
                  tabIndex={copy ? -1 : undefined}
                >
                  <span className={styles.stripSwatch} style={{ background: swatchBackground(finish) }} />
                  <span className={styles.stripName}>{name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
