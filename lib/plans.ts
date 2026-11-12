/** Single source of truth for plans and prices (USD). Used by the pricing section, solutions buttons and structured data. */

export const YEARLY_DISCOUNT = 50; // percent off when billed yearly

export interface Plan {
  /** Plan name as shown on the site and passed to the sign-up link. */
  name: string;
  /** Short label for compact buttons. */
  short: string;
  /** Monthly price in US dollars. */
  monthly: number;
  trial: string;
  blurb: string;
  highlights: string[];
  features: string[];
}

export const PLANS: Plan[] = [
  {
    name: 'Retailer OS', short: 'Retailer OS', monthly: 10, trial: '14-day free trial',
    blurb: 'Record shop sales, track stock, and buy from distributors.',
    highlights: ['1 location and 1 user', 'Barcode scanning'],
    features: ['Shop online from distributors and wholesalers', 'Products, barcodes, batches and expiry dates', 'Suppliers and stock purchases', 'Customer records, credit and expenses', 'Discounts, manual tax and payment references', 'Cash drawer, returns and invoice reprint', 'Basic and advanced reports'],
  },
  {
    name: 'Restaurant OS', short: 'Restaurant OS', monthly: 20, trial: '7-day free trial',
    blurb: 'Take orders, manage your menu, and track stock, sales and deliveries.',
    highlights: ['Free online ordering', 'QR dine-in and takeaway'],
    features: ['Delivery rider management', 'POS with discounts, tax and payment references', 'Daily cash, closing and drawer management', 'Refunds, print and share invoices', 'Menus, recipes and inventory', 'Loyalty program and promo codes', 'Customer reviews and delivery areas', 'Basic and advanced reports'],
  },
  {
    name: 'Distributor / Wholesaler / Manufacturer', short: 'Distributor / Wholesaler / Manufacturer', monthly: 50, trial: '14-day free trial',
    blurb: 'Manage sales and stock, track purchases, and order from merchants.',
    highlights: ['1 location and 1 user', 'FREE: order online from merchants'],
    features: ['Place orders by QR code', 'Customer reviews and loyalty program', 'Products, barcodes, batches and expiry dates', 'Inventory, suppliers and stock purchases', 'Discounts, manual tax and payment references', 'Cash drawer, returns and invoice reprint', 'Customer credit, expenses and delivery areas', 'Basic and advanced reports'],
  },
];

/** Total charged per year with the yearly discount applied. */
export const yearlyTotal = (monthly: number) => Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT / 100));
/** Effective monthly price when billed yearly. */
export const yearlyMonthly = (monthly: number) => yearlyTotal(monthly) / 12;

export const usd = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
export const [RETAILER, RESTAURANT, DISTRIBUTOR] = PLANS;
export const FROM_PRICE = Math.min(...PLANS.map((p) => p.monthly));
