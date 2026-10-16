import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { CATEGORIES, getProductsByCategory } from '../data/products';
import styles from './Products.module.css';

export default function Products() {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('products.eyebrow')}</div>
        <div className={styles.title}>{t('products.title')}</div>
        <div className={styles.desc}>{t('products.desc')}</div>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((category) => {
          const count = getProductsByCategory(category.id).length;
          const name = t(`products.categories.${category.id}`, { defaultValue: category.name });
          return (
            <Link key={category.id} to={`/products/${category.id}`} className={styles.card}>
              <div className={styles.imgWrap}>
                {category.image ? (
                  <img src={category.image} className={styles.img} alt="" />
                ) : (
                  <div className={styles.placeholder}>{name.charAt(0)}</div>
                )}
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardName}>{name}</div>
                <div className={styles.cardMeta}>
                  {count > 0 ? t('products.pieceCount', { count }) : t('products.comingSoon')}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Footer topPadding="0" />
    </div>
  );
}
