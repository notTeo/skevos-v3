import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { getCategory, getProductsByCategory } from '../data/products';
import styles from './Category.module.css';

export default function Category() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const category = getCategory(categoryId);

  if (!category) return <Navigate to="/products" replace />;

  const products = getProductsByCategory(category.id);
  const categoryName = t(`products.categories.${category.id}`, { defaultValue: category.name });

  return (
    <div>
      <div className={styles.crumb}>
        <Link to="/products" className={styles.crumbLink}>{t('product.breadcrumbProducts')}</Link>
        &nbsp;/&nbsp;
        <span className={styles.crumbCurrent}>{categoryName}</span>
      </div>

      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('products.eyebrow')}</div>
        <div className={styles.title}>{categoryName}</div>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>{t('products.comingSoon')}</div>
          <div className={styles.emptyDesc}>{t('products.comingSoonDesc')}</div>
          <Link to="/contact" className={styles.emptyBtn}>{t('products.contactUs')}</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => {
            const productName = t(`catalog.products.${product.id}.name`, { defaultValue: product.name });
            return (
              <Link key={product.id} to={`/product/${product.id}/0`} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={product.finishes[0].img} className={styles.img} alt={productName} />
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.cardName}>{productName}</div>
                  <div className={styles.cardPrice}>{t('products.priceOnRequest')}</div>
                  <div className={styles.cardMeta}>
                    {t('products.finishCount', { count: product.finishes.length })}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <Footer topPadding="0" />
    </div>
  );
}
