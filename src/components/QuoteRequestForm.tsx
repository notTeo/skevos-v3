import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProduct } from '../data/products';
import type { CartItem } from '../context/CartContext';
import { sendQuoteRequest } from '../lib/emailjs';
import styles from './QuoteRequestForm.module.css';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function QuoteRequestForm({
  items,
  onSuccess,
}: {
  items: CartItem[];
  onSuccess: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const buildItemsSummary = () => {
    const englishT = i18n.getFixedT('en');
    return items
      .map((item) => {
        const product = getProduct(item.productId);
        const finish = product.finishes[item.finishIndex] ?? product.finishes[0];
        const productName = englishT(`catalog.products.${item.productId}.name`, { defaultValue: product.name });
        const finishName = englishT(`catalog.finishes.${finish.id}`, { defaultValue: finish.name });
        return `${productName} — ${finishName} x${item.quantity}`;
      })
      .join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      await sendQuoteRequest({
        from_name: name,
        from_email: email,
        from_phone: phone,
        items_summary: buildItemsSummary(),
      });
      setStatus('success');
      onSuccess();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return <div className={styles.success}>{t('cart.success')}</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.desc}>{t('cart.quoteFormDesc')}</div>

      <div className={styles.field}>
        <div className={styles.label}>{t('cart.nameLabel')}</div>
        <input
          className={styles.input}
          placeholder={t('cart.namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <div className={styles.label}>{t('cart.emailLabel')}</div>
        <input
          type="email"
          className={styles.input}
          placeholder={t('cart.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <div className={styles.label}>{t('cart.phoneLabel')}</div>
        <input
          className={styles.input}
          placeholder={t('cart.phonePlaceholder')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {status === 'error' && <div className={styles.error}>{t('cart.error')}</div>}

      <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
        {status === 'sending' ? t('cart.sending') : t('cart.submit')}
      </button>
    </form>
  );
}
