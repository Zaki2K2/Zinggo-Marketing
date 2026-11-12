export type Method = 'cash' | 'easypaisa' | 'jazzcash' | 'bank';
export type Tab = 'home' | 'orders' | 'pos' | 'catalog' | 'reports';
export type View = Tab | 'checkout' | 'receipt';
export type Phase = 'idle' | 'cart' | 'paying' | 'done';
export type Category = 'Main Course' | 'Soups' | 'Drinks' | 'Starters';

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: Category;
  tone: string;
}

export interface SaleLine {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export interface Sale {
  no: string;
  lines: SaleLine[];
  total: number;
  method: Method;
  reference: string | null;
  time: string;
  customer: string;
}

export interface Totals {
  amount: number;
  orders: number;
  byMethod: Record<Method, number>;
  /** Sales per time bucket, oldest to newest. New sales land in the last bucket. */
  buckets: number[];
}

/** Everything the demo shows. Contains no real merchant or customer data. */
export interface DemoState {
  view: View;
  cart: Record<string, number>;
  stock: Record<string, number>;
  sheet: string | null;
  sheetQty: number;
  payment: Method | null;
  sales: Sale[];
  lastSale: Sale | null;
  totals: Totals;
  nextNo: number;
}

export type Action =
  | { type: 'RESET' }
  | { type: 'LOAD'; state: DemoState }
  | { type: 'NAV'; view: Tab }
  | { type: 'OPEN_PRODUCT'; id: string }
  | { type: 'CLOSE_SHEET' }
  | { type: 'SHEET_QTY'; delta: number }
  | { type: 'ADD'; id: string; qty?: number }
  | { type: 'ADD_FROM_SHEET' }
  | { type: 'SET_QTY'; id: string; qty: number }
  | { type: 'GO_CHECKOUT' }
  | { type: 'SELECT_PAYMENT'; method: Method }
  | { type: 'COMPLETE' };
