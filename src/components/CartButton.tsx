import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import styles from './CartButton.module.css';

export default function CartButton({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { itemCount, openDrawer } = useCart();

  return (
    <button
      type="button"
      className={className ? `${styles.button} ${className}` : styles.button}
      aria-label={t('navbar.cart')}
      onClick={openDrawer}
    >
      <ShoppingBag size={20} strokeWidth={1.75} />
      {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
    </button>
  );
}
