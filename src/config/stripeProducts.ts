export const STRIPE_PRODUCTS = {
  PRO_MONTHLY: {
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    name: 'Pro Monthly',
    amount: 7.99,
  },
  ELITE_MONTHLY: {
    priceId: import.meta.env.VITE_STRIPE_ELITE_PRICE_ID || 'price_elite_monthly',
    name: 'Elite Monthly',
    amount: 14.99,
  },
  CREDITS_10: {
    priceId: 'price_credits_10',
    name: '10 Credits',
    amount: 2.00,
    credits: 10,
  },
  CREDITS_30: {
    priceId: 'price_credits_30',
    name: '30 Credits',
    amount: 5.00,
    credits: 30,
  },
  CREDITS_50: {
    priceId: 'price_credits_50',
    name: '50 Credits',
    amount: 8.00,
    credits: 50,
  },
  CREDITS_100: {
    priceId: 'price_credits_100',
    name: '100 Credits',
    amount: 15.00,
    credits: 100,
  },
} as const;
