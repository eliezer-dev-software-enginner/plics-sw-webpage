// app/comprar-inscritos-instagram/constants.ts

export type FollowersTier = {
  quantity: number;
  price: number;
  label: string;
};

export const FOLLOWERS_TIERS: FollowersTier[] = [
  { quantity: 500, price: 10.9, label: '500 inscritos' },
  { quantity: 1000, price: 20.9, label: '1.000 inscritos' },
  { quantity: 2000, price: 41.9, label: '2.000 inscritos' },
  { quantity: 5000, price: 104.9, label: '5.000 inscritos' },
];

export function getTierByQuantity(quantity: number): FollowersTier | undefined {
  return FOLLOWERS_TIERS.find((tier) => tier.quantity === quantity);
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
