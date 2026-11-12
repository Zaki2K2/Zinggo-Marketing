import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SITE, trialHref } from '@/lib/site';

type Plan = { name: string; price: string; trial: string; blurb: string; highlights: string[]; features: string[] };

// Prices, trials and features are taken from the current Zinggo brochures.
const PLANS: Plan[] = [
  {
    name: 'Retailer', price: '999', trial: '14-day free trial', blurb: 'Record shop sales, track stock, and buy from distributors.',
    highlights: ['1 location and 1 user', 'Barcode scanning'],
    features: ['Shop online from distributors and wholesalers', 'Products, barcodes, batches and expiry dates', 'Suppliers and stock purchases', 'Customer records, credit and expenses', 'Discounts, manual tax and payment references', 'Cash drawer, returns and invoice reprint', 'Basic and advanced reports'],
  },
  {
    name: 'Restaurant', price: '2,499', trial: '7-day free trial', blurb: 'Take orders, manage your menu, and track stock, sales and deliveries.',
    highlights: ['Free online ordering', 'QR dine-in and takeaway'],
    features: ['Delivery rider management', 'POS with discounts, tax and payment references', 'Daily cash, closing and drawer management', 'Refunds, print and share invoices', 'Menus, recipes and inventory', 'Loyalty program and promo codes', 'Customer reviews and delivery areas', 'Basic and advanced reports'],
  },
  {
    name: 'Distributor / Wholesaler', price: '4,999', trial: '14-day free trial', blurb: 'Manage sales and stock, track purchases, and order from merchants.',
    highlights: ['1 location and 1 user', 'FREE: order online from merchants'],
    features: ['Place orders by QR code', 'Customer reviews and loyalty program', 'Products, barcodes, batches and expiry dates', 'Inventory, suppliers and stock purchases', 'Discounts, manual tax and payment references', 'Cash drawer, returns and invoice reprint', 'Customer credit, expenses and delivery areas', 'Basic and advanced reports'],
  },
];

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="on-light relative -mt-10 rounded-t-[40px] bg-aqua py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-4 lg:grid-cols-[1fr_0.6fr] lg:items-end">
          <div>
            <p className="t-eyebrow text-brand-ink">Simple pricing</p>
            <h2 id="pricing-title" className="t-section mt-4">Plans that fit your business.</h2>
          </div>
          <p className="t-body text-muted">Choose the tools that match the way you work.</p>
        </Reveal>

        <ul className="mt-14 border-b border-ink/15">
          {PLANS.map((p) => (
            <Reveal as="li" key={p.name} className="group border-t border-ink/15 py-10 transition-colors duration-300 hover:bg-white/60 md:px-4">
              <div className="grid gap-6 md:grid-cols-[1fr_1.3fr_auto] md:items-center">
                <div>
                  <h3 className="text-[clamp(30px,3.6vw,48px)] font-extrabold leading-none tracking-[-0.04em]">{p.name}</h3>
                  <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{p.blurb}</p>
                  <p className="mt-4 inline-block rounded-full bg-amber px-3.5 py-1.5 text-[13px] font-bold text-deep">{p.trial}</p>
                </div>
                <div>
                  <p className="flex items-baseline gap-2"><span className="text-[clamp(40px,5vw,72px)] font-extrabold leading-none tracking-[-0.05em]">Rs {p.price}</span><span className="text-[15px] font-semibold text-muted">/month*</span></p>
                  <p className="mt-3 text-[14.5px] font-bold text-brand-ink">{p.highlights.join(' · ')}</p>
                  <details className="mt-3 text-[14.5px]">
                    <summary className="cursor-pointer font-semibold underline underline-offset-4">What’s included</summary>
                    <ul className="mt-3 space-y-2">
                      {p.features.map((f) => <li key={f} className="flex items-start gap-2"><span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand text-deep"><Icon name="check" size={10} strokeWidth={3.6} /></span>{f}</li>)}
                    </ul>
                  </details>
                </div>
                <a href={trialHref(p.name)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full md:w-auto" aria-label={`Start Free Trial, ${p.name} plan`}>Start Free Trial</a>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8 text-[14px] text-muted">
          <p>*Terms and conditions apply. Larger organization? <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Zinggo for a larger organization')}`} className="font-bold text-brand-ink underline underline-offset-4">Get in touch</a>.</p>
        </Reveal>
      </div>
    </section>
  );
}
