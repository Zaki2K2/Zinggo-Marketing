import { Icon, IconTile, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SITE, trialHref } from '@/lib/site';

type Plan = { name: string; icon: IconName; price: string; trial: string; blurb: string; highlights: string[]; features: string[] };

// Prices, trials and features are taken from the current Zinggo brochures.
const PLANS: Plan[] = [
  {
    name: 'Retailer', icon: 'store', price: '999', trial: '14-day free trial', blurb: 'Record shop sales, track stock, and buy from distributors in one app.',
    highlights: ['1 location and 1 user', 'Barcode scanning'],
    features: ['Shop online from distributors and wholesalers', 'Products, barcodes, batches and expiry dates', 'Suppliers and stock purchases', 'Customer records, credit and expenses', 'Discounts, manual tax and payment references', 'Cash drawer, returns and invoice reprint', 'Basic and advanced reports'],
  },
  {
    name: 'Restaurant', icon: 'utensils', price: '2,499', trial: '7-day free trial', blurb: 'Take orders, manage your menu, and track stock, sales and deliveries.',
    highlights: ['Free online ordering', 'QR dine-in and takeaway'],
    features: ['Delivery rider management', 'POS with discounts, tax and payment references', 'Daily cash, closing and drawer management', 'Refunds, print and share invoices', 'Menus, recipes and inventory', 'Loyalty program and promo codes', 'Customer reviews and delivery areas', 'Basic and advanced reports'],
  },
  {
    name: 'Distributor / Wholesaler', icon: 'truck', price: '4,999', trial: '14-day free trial', blurb: 'Manage sales and stock, track purchases, and order from merchants.',
    highlights: ['1 location and 1 user', 'FREE: order online from merchants'],
    features: ['Place orders by QR code', 'Customer reviews and loyalty program', 'Products, barcodes, batches and expiry dates', 'Inventory, suppliers and stock purchases', 'Discounts, manual tax and payment references', 'Cash drawer, returns and invoice reprint', 'Customer credit, expenses and delivery areas', 'Basic and advanced reports'],
  },
];

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="on-light bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="pricing-title" eyebrow="Simple pricing" title="Plans That Fit Your Business.">
          Choose the tools that match the way you work.
        </SectionHeading>

        <ul className="mt-16 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 90}>
              <article className="flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-soft transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-micro)] hover:-translate-y-1 hover:shadow-lift sm:p-8">
                <div className="flex items-center gap-4">
                  <IconTile name={p.icon} tone={i === 1 ? 'dark' : 'teal'} size={48} />
                  <h3 className="t-card">{p.name}</h3>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">{p.blurb}</p>

                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-[44px] font-extrabold leading-none tracking-[-0.04em]">Rs {p.price}</span>
                  <span className="text-[15px] font-semibold text-muted">/month*</span>
                </p>
                <p className="mt-3 inline-flex w-fit rounded-full bg-amber px-3.5 py-1.5 text-[13px] font-bold text-deep">{p.trial}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {p.highlights.map((h) => <span key={h} className="rounded-full bg-brand-soft px-3 py-1.5 text-[12px] font-bold text-brand-ink">{h}</span>)}
                </div>

                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14.5px] leading-snug"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-deep"><Icon name="check" size={12} strokeWidth={3.4} /></span>{f}</li>
                  ))}
                </ul>

                <a href={trialHref(p.name)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 w-full" aria-label={`Start Free Trial, ${p.name} plan`}>Start Free Trial</a>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10 text-center text-[14px] text-muted">
          <p>*Terms and conditions apply. Prices are per month.</p>
          <p className="mt-2">Larger organization? <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Zinggo for a larger organization')}`} className="font-bold text-brand-ink underline underline-offset-4">Get in touch</a> and tell us what you need.</p>
        </Reveal>
      </div>
    </section>
  );
}
