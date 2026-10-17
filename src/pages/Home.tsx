import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';
import { flattenCatalog, FEATURED_INDICES, swatchBackground } from '../data/products';
import styles from './Home.module.css';

const CATALOG = flattenCatalog();

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const featuredItems = FEATURED_INDICES.map((i) => CATALOG[i]).filter(Boolean);

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>{t('home.eyebrow')}</div>
          <div className={styles.heroTitle}>
            {t('home.heroTitleLine1')}<br />{t('home.heroTitleLine2')}<br />{t('home.heroTitleLine3')}
          </div>
          <div className={styles.heroDesc}>{t('home.heroDesc')}</div>
          <div className={styles.heroActions}>
            <div className={styles.primaryBtn} onClick={() => navigate('/products')}>{t('home.shopCollection')}</div>
            <div className={styles.secondaryBtn} onClick={() => navigate('/about')}>{t('home.ourStory')}</div>
          </div>
        </div>
      </div>

      <div className={styles.intro}>
        <div className={styles.introEyebrow}>{t('home.introEyebrow')}</div>
        <div className={styles.introTitle}>{t('home.introTitle')}</div>
        <div className={styles.introDesc}>{t('home.introDesc')}</div>
      </div>

      <div className={styles.grid}>
        {featuredItems.map((item) => {
          const finishName = t(`catalog.finishes.${item.finish.id}`, { defaultValue: item.finish.name });
          return (
            <div
              key={`${item.productId}-${item.finishIndex}`}
              className={styles.gridItem}
              onClick={() => navigate(`/product/${item.productId}/${item.finishIndex}`)}
            >
              <div className={styles.gridImgWrap}>
                <img src={item.finish.img} className={styles.gridImg} alt={finishName} />
              </div>
              <div className={styles.gridLabel}>
                <div className={styles.swatch} style={{ background: swatchBackground(item.finish) }} />
                <div className={styles.gridName}>{finishName}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.story}>
        <div className={styles.storyEyebrow}>{t('home.storyEyebrow')}</div>
        <div className={styles.storyTitle}>{t('home.storyTitle')}</div>
        <div className={styles.storyLink} onClick={() => navigate('/about')}>{t('home.storyLink')}</div>
      </div>

      <div className={styles.wholesale}>
        <div className={styles.wholesaleTitle}>{t('home.wholesaleTitle')}</div>
        <div className={styles.wholesaleDesc}>{t('home.wholesaleDesc')}</div>
        <div className={styles.wholesaleBtn} onClick={() => navigate('/contact')}>{t('home.wholesaleBtn')}</div>
      </div>

      <Footer />
    </div>
  );
}
