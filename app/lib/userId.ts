// app/lib/userId.ts

export function generateUserId(): string {
  return (
    'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  );
}

export function getUserId(): string | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('plics_user_id');
  if (stored) return stored;

  const newId = generateUserId();
  localStorage.setItem('plics_user_id', newId);
  return newId;
}

export function setUserId(userId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('plics_user_id', userId);
}

const PAYMENT_CACHE_KEY = 'plics_payment_id';

export function savePaymentId(paymentId: string): void {
  console.log('ID: ' + paymentId);
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAYMENT_CACHE_KEY, paymentId);
}

export function getSavedPaymentId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PAYMENT_CACHE_KEY);
}

export function clearPaymentId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PAYMENT_CACHE_KEY);
}
