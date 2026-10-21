import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import {
  CATEGORIES, MATERIALS, getFeaturedItems, getProductsByCategory, swatchBackground,
} from '../data/products';
import styles from './Home.module.css';

const FEATURED_ITEMS = getFeaturedItems();
const STRIP_SPEED = 40; // px per second

// Slides the stone strip in an endless loop with a sub-pixel transform, so it glides
// instead of stepping pixel by pixel. Pauses while hovered, focused or touched; the
// wheel, trackpad and a sideways drag move it with a little easing. The content is
// rendered twice, so wrapping back by half its width is invisible.
function useAutoScroll(stripRef: React.RefObject<HTMLDivElement | null>, trackRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    if (!strip || !track) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let pos = 0;
    let pending = 0; // wheel distance still to glide through
    let speed = reduceMotion ? 0 : STRIP_SPEED; // eases to 0 while paused, back up after
    let paused = false;
    let resumeTimer = 0;
    let last = performance.now();
    let frame = 0;
    let dragX: number | null = null;
    let dragged = 0;

    const render = () => {
      const half = track.scrollWidth / 2;
      pos = ((pos % half) + half) % half;
      track.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const target = paused || reduceMotion ? 0 : STRIP_SPEED;
      speed += (target - speed) * Math.min(1, dt * 4);
      const glide = pending * Math.min(1, dt * 10);
      pending -= glide;
      pos += speed * dt + glide;
      render();
      frame = requestAnimationFrame(tick);
    };
    const pause = () => { paused = true; clearTimeout(resumeTimer); };
    const resumeLater = (ms: number) => {
      clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => { paused = false; }, ms);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pending += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    };
    const onLeave = () => resumeLater(0);
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      pause();
      dragX = e.clientX;
      dragged = 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      dragX = e.clientX;
      dragged += Math.abs(dx);
      pos -= dx;
      render();
    };
    const onPointerUp = () => {
      if (dragX === null) return;
      dragX = null;
      resumeLater(2500);
    };
    // a swipe shouldn't open the stone it started on
    const onClick = (e: MouseEvent) => {
      if (dragged > 6) { e.preventDefault(); dragged = 0; }
    };

    frame = requestAnimationFrame(tick);
    strip.addEventListener('wheel', onWheel, { passive: false });
    strip.addEventListener('mouseenter', pause);
    strip.addEventListener('mouseleave', onLeave);
    strip.addEventListener('focusin', pause);
    strip.addEventListener('focusout', onLeave);
    strip.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    strip.addEventListener('click', onClick, true);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      strip.removeEventListener('wheel', onWheel);
      strip.removeEventListener('mouseenter', pause);
      strip.removeEventListener('mouseleave', onLeave);
      strip.removeEventListener('focusin', pause);
      strip.removeEventListener('focusout', onLeave);
      strip.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      strip.removeEventListener('click', onClick, true);
    };
  }, [stripRef, trackRef]);
}

export default function Home() {
  const { t } = useTranslation();
  const stripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useAutoScroll(stripRef, trackRef);
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
          <p className={styles.heroDescShort}>{t('home.heroDescShort')}</p>
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
          <div className={styles.track} ref={trackRef}>
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
