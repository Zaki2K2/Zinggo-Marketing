import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { d } from '@/components/mockup/parts';
import { trialHref } from '@/lib/site';

const FLOATS = [
  { cls: 'left-[4%] top-[14%] hidden md:flex', text: 'New Order Received!', sub: '#ZG-1042 · Rs 1,850', icon: 'bell' as const, delay: 0 },
  { cls: 'right-[5%] top-[20%] hidden md:flex', text: 'Sale Completed!', sub: 'Invoice generated', icon: 'check' as const, delay: 900 },
  { cls: 'left-[9%] bottom-[12%] hidden lg:flex', text: 'Inventory updated', sub: 'Stock synced', icon: 'box' as const, delay: 1800 },
  { cls: 'right-[8%] bottom-[14%] hidden lg:flex', text: 'Rs 26,700', sub: 'Today’s sales', icon: 'trend' as const, delay: 2600 },
];

export function FinalCta() {
  return (
    <section id="get-started" aria-labelledby="cta-title" className="on-light relative isolate overflow-hidden bg-brand py-28 text-deep sm:py-36">
      <div className="dot-grid-dark absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      {FLOATS.map((f) => (
        <div key={f.text} aria-hidden="true" className={`float-y absolute -z-0 items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_24px_40px_-20px_rgba(7,27,27,0.5)] ${f.cls}`} style={d(f.delay)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-deep text-brand"><Icon name={f.icon} size={18} /></span>
          <span><span className="block text-[13px] font-extrabold">{f.text}</span><span className="block text-[11.5px] text-deep/70">{f.sub}</span></span>
        </div>
      ))}

      <Reveal className="relative z-10 mx-auto max-w-3xl px-5 text-center">
        <h2 id="cta-title" className="t-section">Your Business. Your Future. Your Zinggo.</h2>
        <p className="t-body mx-auto mt-6 max-w-xl text-deep/80">Sell smarter, manage better, and take your business forward with one connected platform.</p>
        <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-10 px-9 py-5 text-[17px]">Start Free Trial <Icon name="arrow" size={20} strokeWidth={2.4} /></a>
        <p className="mt-6 text-[14px] font-medium text-deep/80">Already a merchant? Sign in from the Zinggo Merchant app on your phone.</p>
      </Reveal>
    </section>
  );
}
