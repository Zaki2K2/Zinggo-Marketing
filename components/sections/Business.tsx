import { Reveal } from '@/components/ui/Reveal';
import { InView } from '@/components/ui/InView';
import { Icon } from '@/components/ui/Icon';
import { DistributorScene, RestaurantScene, RetailScene } from '@/components/story/BusinessScenes';
import { trialHref } from '@/lib/site';

const Cta = ({ plan, price, dark }: { plan: string; price: string; dark?: boolean }) => (
  <a href={trialHref(plan)} target="_blank" rel="noopener noreferrer" aria-label={`Start Free Trial, ${plan} plan, ${price} per month`} className={`btn mt-8 max-w-full ${dark ? 'btn-primary' : 'btn-dark'}`}>
    Start Free Trial <span className="font-medium opacity-70">· {price}/mo</span> <Icon name="arrow" size={18} strokeWidth={2.4} />
  </a>
);

export function Business() {
  return (
    <div className="lg:hidden">
      {/* 01 Retail — light, text left, scene right */}
      <section aria-labelledby="retail-title" className="on-light bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="t-eyebrow text-brand-ink">01 · Retailers</p>
            <h2 id="retail-title" className="mt-4 text-[clamp(44px,7vw,104px)] font-extrabold leading-[0.92] tracking-[-0.05em]">The counter, <span className="text-brand-ink">connected.</span></h2>
            <p className="t-body mt-6 max-w-md text-muted">Scan, sell, and see stock drop. When something runs low, reorder from your supplier without leaving the app.</p>
            <p className="mt-5 text-[15px] font-bold">Barcodes · Batches and expiry · Suppliers · Credit</p>
            <Cta plan="Retailer" price="Rs 999" />
          </Reveal>
          <InView><RetailScene /></InView>
        </div>
      </section>

      {/* 02 Restaurants — dark, headline above, wide three-part scene */}
      <section aria-labelledby="restaurant-title" className="relative overflow-hidden bg-night py-24 text-white sm:py-32">
        <div className="absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(0,199,190,0.22),transparent_65%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <p className="t-eyebrow text-brand">02 · Restaurants and cafés</p>
              <h2 id="restaurant-title" className="mt-4 text-[clamp(44px,8vw,128px)] font-extrabold leading-[0.9] tracking-[-0.055em]">Table to kitchen to <span className="text-brand">doorstep.</span></h2>
            </div>
            <div>
              <p className="t-body text-white/70">QR orders for dine-in and takeaway, a live kitchen queue, and delivery riders you can follow.</p>
              <Cta plan="Restaurant" price="Rs 2,499" dark />
            </div>
          </Reveal>
          <InView className="mt-14"><RestaurantScene /></InView>
        </div>
      </section>

      {/* 03 Distributors — grey, scene left, text right */}
      <section aria-labelledby="distributor-title" className="on-light bg-mist py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <InView className="order-2 lg:order-1"><DistributorScene /></InView>
          <Reveal className="order-1 lg:order-2">
            <p className="t-eyebrow text-brand-ink">03 · Distributors and wholesalers</p>
            <h2 id="distributor-title" className="mt-4 text-[clamp(44px,6.4vw,96px)] font-extrabold leading-[0.92] tracking-[-0.05em]">Every order, <span className="text-brand-ink">on route.</span></h2>
            <p className="t-body mt-6 max-w-md text-muted">Take orders from merchants, keep carton stock honest, and organise deliveries by area.</p>
            <p className="mt-5 text-[15px] font-bold">Merchant ordering · Delivery areas · Suppliers · Reports</p>
            <Cta plan="Distributor / Wholesaler" price="Rs 4,999" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
