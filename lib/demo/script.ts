import { initialState } from './data';
import { reducer } from './reducer';
import type { Action, DemoState } from './types';

/**
 * The automatic demonstration: one coherent sale.
 * 2 x Chicken Biryani + 1 x Zinger Burger + 2 x Mint Lemonade = Rs 1,850, paid by Easypaisa.
 * Each step optionally taps an on-screen target (data-demo="...") before applying its action(s).
 */
export interface Step {
  label: string;
  /** data-demo target the cursor taps before the action runs. */
  tap?: string;
  action?: Action | Action[];
  /** Hold time after the action, in ms. */
  wait: number;
}

export const SCRIPT: Step[] = [
  { label: 'Dashboard: today’s sales at a glance', wait: 2600 },
  { label: 'Open the point of sale', tap: 'tab-pos', action: { type: 'NAV', view: 'pos' }, wait: 900 },
  { label: 'Open a product', tap: 'product-biryani', action: { type: 'OPEN_PRODUCT', id: 'biryani' }, wait: 800 },
  { label: 'Set the quantity', tap: 'sheet-plus', action: { type: 'SHEET_QTY', delta: 1 }, wait: 800 },
  { label: 'Add to cart', tap: 'sheet-add', action: { type: 'ADD_FROM_SHEET' }, wait: 700 },
  { label: 'Add a burger', tap: 'add-burger', action: { type: 'ADD', id: 'burger' }, wait: 650 },
  { label: 'Add lemonade', tap: 'add-lemonade', action: { type: 'ADD', id: 'lemonade' }, wait: 520 },
  { label: 'Add a second lemonade', tap: 'add-lemonade', action: { type: 'ADD', id: 'lemonade' }, wait: 800 },
  { label: 'Review the cart: Rs 1,850', tap: 'cart-bar', action: { type: 'GO_CHECKOUT' }, wait: 1000 },
  { label: 'Choose how the customer paid', tap: 'pay-easypaisa', action: { type: 'SELECT_PAYMENT', method: 'easypaisa' }, wait: 1100 },
  { label: 'Complete the sale. An invoice is generated', tap: 'complete', action: { type: 'COMPLETE' }, wait: 2800 },
  { label: 'Stock has updated', tap: 'tab-catalog', action: { type: 'NAV', view: 'catalog' }, wait: 2800 },
  { label: 'The sale is in the sales history', tap: 'tab-orders', action: { type: 'NAV', view: 'orders' }, wait: 2800 },
  { label: 'Reports include the sale', tap: 'tab-reports', action: { type: 'NAV', view: 'reports' }, wait: 3000 },
  { label: 'Back to the dashboard', tap: 'tab-home', action: { type: 'NAV', view: 'home' }, wait: 2800 },
];

/** Groups shown in the hero tracker. `from` is the first step index of the group. */
export const GROUPS = [
  { key: 'add', label: 'Add items', from: 1 },
  { key: 'pay', label: 'Take payment', from: 8 },
  { key: 'stock', label: 'Stock updates', from: 11 },
  { key: 'orders', label: 'Sales history', from: 12 },
  { key: 'reports', label: 'Reports', from: 13 },
] as const;

export const groupOf = (stepIndex: number) => {
  let g = -1;
  GROUPS.forEach((x, i) => { if (stepIndex >= x.from) g = i; });
  return g;
};

/** Deterministically replays steps [0, upTo) instantly, so the demo can jump to any point. */
export function stateBefore(upTo: number): DemoState {
  let s = initialState();
  for (let i = 0; i < upTo; i++) {
    const a = SCRIPT[i].action;
    if (!a) continue;
    for (const act of Array.isArray(a) ? a : [a]) s = reducer(s, act);
  }
  return s;
}
