import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { getCategory, getProductsByCategory, swatchBackground, type Finish } from '../data/products';
import styles from './Category.module.css';

export default function Category() {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = getCategory(categoryId);

  if (!category) return <Navigate to="/products" replace />;

  const products = getProductsByCategory(category.id);
  const categoryName = t(`products.categories.${category.id}`, { defaultValue: category.name });

  // every material offered in this category, in first-seen order
  const finishes = [...new Map(products.flatMap((p) => p.finishes).map((f): [string, Finish] => [f.id, f])).values()];
  const selectedId = finishes.some((f) => f.id === searchParams.get('finish')) ? searchParams.get('finish') : null;
  const finishName = (f: Finish) => t(`catalog.finishes.${f.id}`, { defaultValue: f.name });

  // with a material picked, show each product in it and hide products that don't come in it
  const cards = products
    .map((product) => {
      const index = selectedId ? product.finishes.findIndex((f) => f.id === selectedId) : 0;
      return { product, index };
    })
    .filter(({ index }) => index !== -1);

  const selectFinish = (id: string) => {
    setSearchParams(id === selectedId ? {} : { finish: id }, { replace: true });
  };

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
        {finishes.length > 0 && (
          <>
            <div className={styles.swatches}>
              {finishes.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={f.id === selectedId ? `${styles.swatch} ${styles.swatchActive}` : styles.swatch}
                  style={{ background: swatchBackground(f) }}
                  title={finishName(f)}
                  aria-label={finishName(f)}
                  aria-pressed={f.id === selectedId}
                  onClick={() => selectFinish(f.id)}
                />
              ))}
            </div>
            <div className={styles.swatchName}>
              {selectedId ? finishName(finishes.find((f) => f.id === selectedId)!) : ' '}
            </div>
          </>
        )}
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyTitle}>{t('products.comingSoon')}</div>
          <div className={styles.emptyDesc}>{t('products.comingSoonDesc')}</div>
          <Link to="/contact" className={styles.emptyBtn}>{t('products.contactUs')}</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {cards.map(({ product, index }) => {
            const productName = t(`catalog.products.${product.id}.name`, { defaultValue: product.name });
            return (
              <Link key={product.id} to={`/product/${product.id}/${index}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={product.finishes[index].img} className={styles.img} alt={productName} />
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
