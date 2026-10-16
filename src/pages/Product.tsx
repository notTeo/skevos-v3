import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { getCategory, getProduct, isCollage } from '../data/products';
import { useCart } from '../context/CartContext';
import styles from './Product.module.css';

export default function Product() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem, openDrawer } = useCart();
  const { productId, finishIndex } = useParams();
  const product = getProduct(productId);
  const category = getCategory(product.category);
  const selectedIndex = Number(finishIndex) || 0;
  const current = product.finishes[selectedIndex] ?? product.finishes[0];

  const productName = t(`catalog.products.${product.id}.name`, { defaultValue: product.name });
  const productDesc = t(`catalog.products.${product.id}.description`, { defaultValue: product.description });
  const currentFinishName = t(`catalog.finishes.${current.id}`, { defaultValue: current.name });

  // hero first, then the extra views; the chosen view resets when the finish changes
  const views = [current.img, ...(current.gallery ?? [])];
  const [view, setView] = useState({ img: current.img, index: 0 });
  const viewIndex = view.img === current.img ? view.index : 0;

  const relatedIndices = [1, 2, 3, 4, 5]
    .map((o) => (selectedIndex + o) % product.finishes.length)
    .filter((i) => i !== selectedIndex);
  const relatedFinishes = relatedIndices.map((i) => product.finishes[i]);

  return (
    <div>
      <div className={styles.crumb}>
        <span className={styles.crumbLink} onClick={() => navigate('/products')}>{t('product.breadcrumbProducts')}</span>
        &nbsp;/&nbsp;
        {category && (
          <>
            <span className={styles.crumbLink} onClick={() => navigate(`/products/${category.id}`)}>
              {t(`products.categories.${category.id}`, { defaultValue: category.name })}
            </span>
            &nbsp;/&nbsp;
          </>
        )}
        <span className={styles.crumbCurrent}>{productName} &mdash; {currentFinishName}</span>
      </div>

      <div className={styles.layout}>
        <div className={styles.imgWrap}>
          <img src={views[viewIndex] ?? current.img} className={styles.img} alt={currentFinishName} />
          {views.length > 1 && (
            <div className={styles.thumbs}>
              {views.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  className={styles.thumb}
                  style={{ borderColor: i === viewIndex ? 'var(--tan)' : 'transparent' }}
                  alt=""
                  loading="lazy"
                  onClick={() => setView({ img: current.img, index: i })}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.eyebrow}>{productName}</div>
          <div className={styles.title}>{currentFinishName}</div>
          <div className={styles.desc}>{productDesc}</div>

          <div className={styles.finishLabel}>{t('product.chooseAFinish')}</div>
          <div className={styles.swatches}>
            {product.finishes.map((f, i) => (
              <div
                key={f.id}
                className={styles.swatch}
                style={{
                  background: f.hex,
                  border: i === selectedIndex ? '3px solid var(--tan)' : '3px solid transparent',
                }}
                title={t(`catalog.finishes.${f.id}`, { defaultValue: f.name })}
                onClick={() => navigate(`/product/${product.id}/${i}`)}
              />
            ))}
          </div>

          <div className={styles.actions}>
            <div
              className={styles.primaryBtn}
              onClick={() => {
                addItem(product.id, selectedIndex);
                openDrawer();
              }}
            >
              {t('product.addToCart')}
            </div>
            <div className={styles.secondaryBtn} onClick={() => navigate('/contact')}>{t('product.requestPricing')}</div>
            <div className={styles.secondaryBtn} onClick={() => navigate('/contact')}>{t('product.askAboutWholesale')}</div>
          </div>

          <div className={styles.specs}>
            <div><div className={styles.specLabel}>{t('product.specs.materialLabel')}</div>{t('product.specs.materialValue')}</div>
            <div><div className={styles.specLabel}>{t('product.specs.finishLabel')}</div>{t('product.specs.finishValue')}</div>
            <div><div className={styles.specLabel}>{t('product.specs.careLabel')}</div>{t('product.specs.careValue')}</div>
            <div><div className={styles.specLabel}>{t('product.specs.originLabel')}</div>{t('product.specs.originValue')}</div>
          </div>
        </div>
      </div>

      {relatedFinishes.length > 0 && (
        <div className={styles.relatedWrap}>
          <div className={styles.relatedLabel}>{t('product.otherFinishes')}</div>
          <div className={styles.relatedGrid}>
            {relatedFinishes.map((f) => {
              const relatedName = t(`catalog.finishes.${f.id}`, { defaultValue: f.name });
              return (
                <div
                  key={f.id}
                  className={styles.relatedItem}
                  onClick={() => navigate(`/product/${product.id}/${product.finishes.indexOf(f)}`)}
                >
                  <div className={styles.relatedImgWrap}>
                    <img src={f.img} className={`${styles.relatedImg} ${isCollage(f.img) ? styles.collage : ''}`} alt={relatedName} />
                  </div>
                  <div className={styles.relatedName}>{relatedName}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Footer topPadding="40px" />
    </div>
  );
}
