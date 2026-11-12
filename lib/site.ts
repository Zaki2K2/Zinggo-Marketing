export const SITE = {
  name: 'Zinggo',
  title: 'Zinggo — One Platform to Run Your Business',
  description:
    'Manage your sales, inventory, orders, customers, and daily operations with Zinggo. Smart business management for retailers, restaurants, distributors, and growing businesses.',
  email: 'hi@zinggo.app',
  phone: '+92 307 533 6334',
  /** Official WhatsApp number from the brochures. Used as the trial sign-up destination until a sign-up URL exists. */
  whatsapp: 'https://wa.me/923075336334',
} as const;

/** Start Free Trial destination. Replace with a hosted sign-up URL when one is available. */
export function trialHref(plan?: string): string {
  const text = plan
    ? `Hi Zinggo, I would like to start the free trial of the ${plan} plan.`
    : 'Hi Zinggo, I would like to start a free trial.';
  return `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const NAV_LINKS = [
  { label: 'Why Zinggo', href: '#why-zinggo' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Community', href: '#community' },
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
