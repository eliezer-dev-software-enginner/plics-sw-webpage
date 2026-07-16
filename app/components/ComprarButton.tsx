'use client';

import { getSavedPaymentId, getUserId, setUserId } from '@/app/lib/userId';
import { ArrowRight, ShoppingCart } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { UTM } from '../lib/common';

type ButtonProps = {
  variant?: 'primary' | 'accent';
  utm: UTM;
};

export function ComprarButton({ variant = 'primary', utm }: ButtonProps) {
  const { source, medium, campaign, content } = utm;
  const router = useRouter();

  const handleBuy = () => {
    let userId = getUserId();
    if (!userId) {
      userId =
        'user_' +
        Date.now() +
        '_' +
        Math.random().toString(36).substring(2, 11);
      setUserId(userId);
    }

    const savedPaymentId = getSavedPaymentId();
    const params = new URLSearchParams({ userId });
    if (savedPaymentId) {
      params.set('paymentId', savedPaymentId);
    }

    if (source) {
      params.set('utm_source', source);
    }

    if (medium) {
      params.set('utm_medium', medium);
    }

    if (campaign) {
      params.set('utm_campaign', campaign);
    }

    if (content) {
      params.set('utm_content', content);
    }
    router.push(`/comprar-plics-sw?${params.toString()}`);
  };

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '1.125rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'transform 200ms, background-color 200ms',
  };

  const styles =
    variant === 'accent'
      ? { ...baseStyle, backgroundColor: 'var(--accent)', color: '#000' }
      : { ...baseStyle, backgroundColor: 'var(--primary)', color: '#fff' };

  return (
    <button style={styles} onClick={handleBuy}>
      {variant === 'accent' ? (
        <ShoppingCart size={20} />
      ) : (
        <ArrowRight size={20} />
      )}
      {variant === 'accent' ? 'Comprar Já' : 'Começar Agora'}
    </button>
  );
}
