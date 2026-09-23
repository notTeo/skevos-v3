import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import styles from './Products.module.css';

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();
  const [filter, setFilter] = useState('All');
  const [selectedFinish, setSelectedFinish] = useState<Record<string, number>>({});

  const shownProducts = filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.eyebrow}>{t('products.eyebrow')}</div>
        <div className={styles.title}>{t('products.title')}</div>
        <div className={styles.desc}>{t('products.desc')}</div>
      </div>

      {CATEGORIES.length > 2 && (
        <div className={styles.chips}>
          {CATEGORIES.map((name) => {
            const active = filter === name;
            return (
              <div
                key={name}
                className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                onClick={() => setFilter(name)}
              >
                {t(`products.categories.${name}`, { defaultValue: name })}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.grid}>
        {shownProducts.map((product) => {
          const activeIndex = selectedFinish[product.id] ?? 0;
          const activeFinish = product.finishes[activeIndex];
          const productName = t(`catalog.products.${product.id}.name`, { defaultValue: product.name });
          const activeFinishName = t(`catalog.finishes.${activeFinish.id}`, { defaultValue: activeFinish.name });
          return (
            <div key={product.id} className={styles.card}>
              <div
                className={styles.imgWrap}
                onClick={() => navigate(`/product/${product.id}/${activeIndex}`)}
              >
                <img src={activeFinish.img} className={styles.img} alt={`${productName} — ${activeFinishName}`} />
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.cardName}>{productName}</div>
                <div className={styles.cardPrice}>{t('products.priceOnRequest')}</div>
                <div className={styles.swatchRow}>
                  {product.finishes.map((f, i) => (
                    <div
                      key={f.id}
                      className={i === activeIndex ? `${styles.swatch} ${styles.swatchActive}` : styles.swatch}
                      style={{ background: f.hex }}
                      title={t(`catalog.finishes.${f.id}`, { defaultValue: f.name })}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFinish((prev) => ({ ...prev, [product.id]: i }));
                      }}
                    />
                  ))}
                </div>
                <div
                  className={styles.addToCartBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(product.id, activeIndex);
                    openDrawer();
                  }}
                >
                  {t('products.addToCart')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Footer topPadding="0" />
    </div>
  );
}
