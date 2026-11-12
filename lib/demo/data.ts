import type { DemoState, Method, Product, Sale } from './types';

/** Fictional demo catalogue. */
const RAW: Omit<Product, 'image'>[] = [
  { id: 'biryani', name: 'Chicken Biryani', price: 450, unit: 'plate', category: 'Main Course', tone: '#e8890c' },
  { id: 'burger', name: 'Zinger Burger', price: 550, unit: 'each', category: 'Main Course', tone: '#c0392b' },
  { id: 'pasta', name: 'Red Sauce Pasta', price: 200, unit: 'plate', category: 'Main Course', tone: '#d9531e' },
  { id: 'soup', name: 'Chicken Corn Soup', price: 500, unit: '500 ml', category: 'Soups', tone: '#b8860b' },
  { id: 'lemonade', name: 'Mint Lemonade', price: 200, unit: '250 ml', category: 'Drinks', tone: '#1aa37a' },
  { id: 'fries', name: 'Masala Fries', price: 250, unit: 'each', category: 'Starters', tone: '#6d5bd0' },
];

export const PRODUCTS: Product[] = RAW.map((p) => ({ ...p, image: `/products/${p.id}.jpg` }));

export const CATEGORIES = ['All', 'Main Course', 'Soups', 'Drinks', 'Starters'] as const;
export const LOW_STOCK_AT = 5;

export const INITIAL_STOCK: Record<string, number> = { biryani: 24, burger: 18, pasta: 15, soup: 12, lemonade: 40, fries: 4 };

export const METHODS: { id: Method; label: string; prefix: string }[] = [
  { id: 'cash', label: 'Cash', prefix: '' },
  { id: 'easypaisa', label: 'Easypaisa', prefix: 'EP' },
  { id: 'jazzcash', label: 'JazzCash', prefix: 'JC' },
  { id: 'bank', label: 'Bank', prefix: 'BK' },
];

export const BUCKET_LABELS = ['9a', '11a', '1p', '3p', '5p', '7p', '9p'];

const SEED_SALES: Sale[] = [
  { no: '#ZG-1041', lines: [{ id: 'burger', name: 'Zinger Burger', qty: 1, price: 550 }, { id: 'fries', name: 'Masala Fries', qty: 1, price: 250 }], total: 800, method: 'cash', reference: null, time: '3:58 PM', customer: 'Walk-in' },
  { no: '#ZG-1040', lines: [{ id: 'biryani', name: 'Chicken Biryani', qty: 2, price: 450 }], total: 900, method: 'jazzcash', reference: 'JC-88229', time: '3:41 PM', customer: 'Walk-in' },
  { no: '#ZG-1039', lines: [{ id: 'soup', name: 'Chicken Corn Soup', qty: 1, price: 500 }, { id: 'lemonade', name: 'Mint Lemonade', qty: 1, price: 200 }], total: 700, method: 'easypaisa', reference: 'EP-88228', time: '3:12 PM', customer: 'Walk-in' },
];

/** Opening position for the day. Method shares and hourly buckets both sum to the day total. */
export function initialState(): DemoState {
  return {
    view: 'home',
    cart: {},
    stock: { ...INITIAL_STOCK },
    sheet: null,
    sheetQty: 1,
    payment: null,
    sales: SEED_SALES.map((s) => ({ ...s, lines: s.lines.map((l) => ({ ...l })) })),
    lastSale: null,
    totals: {
      amount: 24850,
      orders: 38,
      byMethod: { cash: 9400, easypaisa: 8450, jazzcash: 4600, bank: 2400 },
      buckets: [1850, 3200, 4100, 3650, 5200, 4300, 2550],
    },
    nextNo: 1042,
  };
}

/** Deterministic payment reference, e.g. EP-88231 for order 1042. Cash has none. */
export function referenceFor(method: Method, orderNo: number): string | null {
  const m = METHODS.find((x) => x.id === method);
  return m && m.prefix ? `${m.prefix}-${87189 + orderNo}` : null;
}
