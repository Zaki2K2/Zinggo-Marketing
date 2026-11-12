export const SITE = {
  name: 'Zinggo',
  title: 'Zinggo — One Platform to Run Your Business',
  description:
    'Manage your sales, inventory, orders, customers, and daily operations with Zinggo. Smart business management for retailers, restaurants, distributors, and growing businesses.',
  email: 'hi@zinggo.app',
  phone: '+92 307 533 6334',
  /** Official WhatsApp number from the brochures. Used for the footer contact link. */
  whatsapp: 'https://wa.me/923075336334',
  /** Merchant sign-up / login page that every Start Free Trial button opens. */
  trialUrl: 'https://merchants.zinggo.app/login/merchant',
} as const;

/** Start Free Trial destination: the merchant login page. `plan` is accepted for call-site clarity but the page is the same for every plan. */
export function trialHref(_plan?: string): string {
  return SITE.trialUrl;
}

export const NAV_LINKS = [
  { label: 'Why Zinggo', href: '#why-zinggo' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
] as const;

/** Legal pages: no hosted URLs exist yet, so these route to an email request. Set `url` once published. */
export const LEGAL_LINKS = [
  { label: 'Privacy Policy', url: '' },
  { label: 'Terms and Conditions', url: '' },
] as const;

export function legalHref(item: { label: string; url: string }): string {
  return item.url || `mailto:${SITE.email}?subject=${encodeURIComponent(`Request: ${item.label}`)}`;
}

export const rs = (n: number) => `Rs ${n.toLocaleString('en-PK')}`;
