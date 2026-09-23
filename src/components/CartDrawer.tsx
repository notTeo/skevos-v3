import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProduct } from '../data/products';
import QuoteRequestForm from './QuoteRequestForm';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, itemCount, isDrawerOpen, closeDrawer, removeItem, setQuantity, clear } = useCart();
  const [view, setView] = useState<'cart' | 'quote'>('cart');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDrawerOpen) {
      setView('cart');
      closeRef.current?.focus();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDrawerOpen, closeDrawer]);

  const goToProducts = () => {
    closeDrawer();
    navigate('/products');
  };

  return (
    <>
      <div
        className={isDrawerOpen ? `${styles.backdrop} ${styles.backdropOpen}` : styles.backdrop}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div
        className={isDrawerOpen ? `${styles.drawer} ${styles.drawerOpen}` : styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
      >
        <div className={styles.header}>
          <span className={styles.heading}>{view === 'quote' ? t('cart.quoteFormTitle') : t('cart.title')}</span>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeBtn}
            aria-label={t('cart.close')}
            onClick={closeDrawer}
          >
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>

        {view === 'quote' ? (
          <div className={styles.body}>
            <button type="button" className={styles.backLink} onClick={() => setView('cart')}>
              &larr; {t('cart.backToCart')}
            </button>
            <QuoteRequestForm items={items} onSuccess={() => clear()} />
          </div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>{t('cart.empty')}</div>
            <div className={styles.emptyDesc}>{t('cart.emptyDesc')}</div>
            <button type="button" className={styles.browseBtn} onClick={goToProducts}>
              {t('cart.browseProducts')}
            </button>
          </div>
        ) : (
          <div className={styles.body}>
            <div className={styles.list}>
              {items.map((item) => {
                const product = getProduct(item.productId);
                const finish = product.finishes[item.finishIndex] ?? product.finishes[0];
                return (
                  <div key={item.id} className={styles.row}>
                    <img src={finish.img} className={styles.thumb} alt={finish.name} />
                    <div className={styles.rowInfo}>
                      <div className={styles.rowName}>
                        {t(`catalog.products.${item.productId}.name`, { defaultValue: product.name })}
                      </div>
                      <div className={styles.rowFinish}>
                        {t(`catalog.finishes.${finish.id}`, { defaultValue: finish.name })}
                      </div>
                      <div className={styles.rowControls}>
                        <div className={styles.stepper}>
                          <button
                            type="button"
                            aria-label={t('cart.remove')}
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={13} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="+"
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="button" className={styles.offerBtn} onClick={() => setView('quote')}>
              {t('cart.requestOffer')} ({itemCount})
            </button>
          </div>
        )}
      </div>
    </>
  );
}
