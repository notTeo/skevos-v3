import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { PRODUCTS, swatchBackground, type Finish } from '../data/products';
import styles from './Materials.module.css';

// every material in the catalog, once each, in first-seen order
const MATERIALS: Finish[] = [
  ...new Map(PRODUCTS.flatMap((p) => p.finishes).map((f) => [f.id, f])).values(),
];

export default function Materials() {
  const { t } = useTranslation();
  // tapped sample on touch screens; hover and keyboard focus are handled in CSS
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('materials.eyebrow')}</div>
        <div className={styles.title}>{t('materials.title')}</div>
        <div className={styles.desc}>{t('materials.desc')}</div>
      </div>

      <div className={styles.grid}>
        {MATERIALS.map((finish) => {
          const name = t(`catalog.finishes.${finish.id}`, { defaultValue: finish.name });
          const isActive = active === finish.id;
          return (
            <div key={finish.id} className={`${styles.slot} ${isActive ? styles.active : ''}`}>
              <button
                type="button"
                className={styles.sample}
                style={{ background: swatchBackground(finish) }}
                aria-label={name}
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : finish.id)}
              />
              <div className={styles.name}>{name}</div>
              <div className={styles.card} role="tooltip">
                <div className={styles.cardName}>{name}</div>
                <p className={styles.cardInfo}>{t(`catalog.finishInfo.${finish.id}`)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Footer topPadding="0" />
    </div>
  );
}
