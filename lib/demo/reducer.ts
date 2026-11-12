import { PRODUCTS, initialState, referenceFor } from './data';
import type { Action, DemoState, Phase, Sale } from './types';

const price = (id: string) => PRODUCTS.find((p) => p.id === id)?.price ?? 0;
const name = (id: string) => PRODUCTS.find((p) => p.id === id)?.name ?? id;

export const cartCount = (s: DemoState) => Object.values(s.cart).reduce((a, b) => a + b, 0);
export const cartTotal = (s: DemoState) => Object.entries(s.cart).reduce((a, [id, q]) => a + price(id) * q, 0);
export const available = (s: DemoState, id: string) => Math.max(0, (s.stock[id] ?? 0) - (s.cart[id] ?? 0));
export const averageOrder = (s: DemoState) => (s.totals.orders ? Math.round(s.totals.amount / s.totals.orders) : 0);

export function phaseOf(s: DemoState): Phase {
  if (s.view === 'receipt') return 'done';
  if (s.view === 'checkout') return 'paying';
  return cartCount(s) > 0 ? 'cart' : 'idle';
}

function withItem(cart: Record<string, number>, id: string, qty: number) {
  const next = { ...cart };
  if (qty <= 0) delete next[id];
  else next[id] = qty;
  return next;
}

/**
 * Transaction state machine for the marketing demo.
 * Guards keep the state consistent: no overselling, no checkout with an empty cart,
 * no completing a sale without a payment method.
 */
export function reducer(s: DemoState, a: Action): DemoState {
  switch (a.type) {
    case 'RESET':
      return initialState();
    case 'LOAD':
      return a.state;
    case 'NAV':
      return { ...s, view: a.view, sheet: null };
    case 'OPEN_PRODUCT':
      return available(s, a.id) > 0 ? { ...s, sheet: a.id, sheetQty: 1 } : s;
    case 'CLOSE_SHEET':
      return { ...s, sheet: null };
    case 'SHEET_QTY': {
      if (!s.sheet) return s;
      const max = Math.max(1, available(s, s.sheet));
      return { ...s, sheetQty: Math.min(max, Math.max(1, s.sheetQty + a.delta)) };
    }
    case 'ADD': {
      const room = available(s, a.id);
      if (room <= 0) return s;
      const add = Math.min(a.qty ?? 1, room);
      return { ...s, cart: withItem(s.cart, a.id, (s.cart[a.id] ?? 0) + add) };
    }
    case 'ADD_FROM_SHEET': {
      if (!s.sheet) return s;
      const room = available(s, s.sheet);
      const add = Math.min(s.sheetQty, room);
      return { ...s, cart: withItem(s.cart, s.sheet, (s.cart[s.sheet] ?? 0) + add), sheet: null, sheetQty: 1 };
    }
    case 'SET_QTY': {
      const qty = Math.max(0, Math.min(a.qty, s.stock[a.id] ?? 0));
      const cart = withItem(s.cart, a.id, qty);
      const empty = Object.keys(cart).length === 0;
      return { ...s, cart, view: empty && s.view === 'checkout' ? 'pos' : s.view };
    }
    case 'GO_CHECKOUT':
      return cartCount(s) > 0 ? { ...s, view: 'checkout', sheet: null } : s;
    case 'SELECT_PAYMENT':
      return { ...s, payment: a.method };
    case 'COMPLETE': {
      if (cartCount(s) === 0 || !s.payment) return s;
      const total = cartTotal(s);
      const sale: Sale = {
        no: `#ZG-${s.nextNo}`,
        lines: Object.entries(s.cart).map(([id, qty]) => ({ id, name: name(id), qty, price: price(id) })),
        total,
        method: s.payment,
        reference: referenceFor(s.payment, s.nextNo),
        time: 'Just now',
        customer: 'Walk-in',
      };
      const stock = { ...s.stock };
      for (const l of sale.lines) stock[l.id] = Math.max(0, (stock[l.id] ?? 0) - l.qty);
      const buckets = [...s.totals.buckets];
      buckets[buckets.length - 1] += total;
      return {
        ...s,
        view: 'receipt',
        cart: {},
        stock,
        payment: null,
        sales: [sale, ...s.sales],
        lastSale: sale,
        nextNo: s.nextNo + 1,
        totals: {
          amount: s.totals.amount + total,
          orders: s.totals.orders + 1,
          byMethod: { ...s.totals.byMethod, [sale.method]: s.totals.byMethod[sale.method] + total },
          buckets,
        },
      };
    }
    default:
      return s;
  }
}
