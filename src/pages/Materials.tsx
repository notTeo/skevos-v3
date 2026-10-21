import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import {
  MATERIALS, TONES, materialTone, swatchBackground, type Tone,
} from '../data/products';
import styles from './Materials.module.css';

export default function Materials() {
  const { t } = useTranslation();
  const { hash } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const toneParam = searchParams.get('tone');
  const selected = TONES.find((tone) => tone === toneParam) ?? null;
  const groups = (selected ? [selected] : TONES).map((tone) => ({
    tone,
    items: MATERIALS.filter((f) => materialTone(f) === tone),
  }));

  // links from the home page point at one stone, e.g. /materials#green
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'center' });
  }, [hash]);

  const selectTone = (tone: Tone | null) => {
    setSearchParams(tone ? { tone } : {}, { replace: true });
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('materials.eyebrow')}</div>
        <h1 className={styles.title}>{t('materials.title')}</h1>
        <p className={styles.desc}>{t('materials.desc')}</p>
      </div>

      <div className={styles.chipsBar}>
        <div className={styles.chips} role="group" aria-label={t('materials.filterLabel')}>
          <button type="button" className={styles.chip} aria-pressed={!selected} onClick={() => selectTone(null)}>
            {t('materials.all')} <span className={styles.chipCount}>{MATERIALS.length}</span>
          </button>
          {TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              className={styles.chip}
              aria-pressed={selected === tone}
              onClick={() => selectTone(selected === tone ? null : tone)}
            >
              {t(`materials.tones.${tone}`)}{' '}
              <span className={styles.chipCount}>{MATERIALS.filter((f) => materialTone(f) === tone).length}</span>
            </button>
          ))}
        </div>
      </div>

      {groups.map(({ tone, items }) => (
        <section key={tone} className={styles.group}>
          <h2 className={styles.groupTitle}>{t(`materials.tones.${tone}`)}</h2>
          <div className={styles.grid}>
            {items.map((finish) => {
              const name = t(`catalog.finishes.${finish.id}`, { defaultValue: finish.name });
              return (
                <article key={finish.id} id={finish.id} className={styles.card}>
                  <div className={styles.sample} style={{ background: swatchBackground(finish) }} role="img" aria-label={name} />
                  <div className={styles.body}>
                    <h3 className={styles.name}>{name}</h3>
                    <p className={styles.info}>{t(`catalog.finishInfo.${finish.id}`)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <div className={styles.end} />
      <Footer topPadding="0" />
    </div>
  );
}
