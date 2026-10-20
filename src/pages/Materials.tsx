import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { PRODUCTS, swatchBackground, type Finish } from '../data/products';
import styles from './Materials.module.css';

// every material in the catalog, in first-seen order, with how many pieces come in it
const MATERIALS = [
  ...PRODUCTS.flatMap((p) => p.finishes)
    .reduce((map, f) => {
      const entry = map.get(f.id);
      if (entry) entry.count += 1;
      else map.set(f.id, { finish: f, count: 1 });
      return map;
    }, new Map<string, { finish: Finish; count: number }>())
    .values(),
];

export default function Materials() {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('materials.eyebrow')}</div>
        <div className={styles.title}>{t('materials.title')}</div>
        <div className={styles.desc}>{t('materials.desc')}</div>
      </div>

      <div className={styles.grid}>
        {MATERIALS.map(({ finish, count }) => (
          <div key={finish.id} className={styles.card}>
            <div className={styles.swatch} style={{ background: swatchBackground(finish) }} />
            <div className={styles.cardName}>{t(`catalog.finishes.${finish.id}`, { defaultValue: finish.name })}</div>
            <div className={styles.cardMeta}>{t('products.pieceCount', { count })}</div>
          </div>
        ))}
      </div>

      <Footer topPadding="0" />
    </div>
  );
}
