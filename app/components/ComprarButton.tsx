'use client';

import { ArrowRight, ShoppingCart } from 'lucide-react';
import { getUserId, getSavedPaymentId, setUserId } from '@/app/lib/userId';
import { useRouter } from 'next/navigation';

export function ComprarButton({ variant = 'primary' }: { variant?: 'primary' | 'accent' }) {
  const router = useRouter();

  const handleBuy = () => {
    let userId = getUserId();
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      setUserId(userId);
    }

    const savedPaymentId = getSavedPaymentId();
    const params = new URLSearchParams({ userId });
    if (savedPaymentId) {
      params.set('paymentId', savedPaymentId);
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

  const styles = variant === 'accent' 
    ? { ...baseStyle, backgroundColor: 'var(--accent)', color: '#000' }
    : { ...baseStyle, backgroundColor: 'var(--primary)', color: '#fff' };

  return (
    <button 
      style={styles} 
      onClick={handleBuy}
    >
      {variant === 'accent' ? <ShoppingCart size={20} /> : <ArrowRight size={20} />}
      {variant === 'accent' ? 'Comprar Já' : 'Começar Agora'}
    </button>
  );
}
