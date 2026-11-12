import { Reveal } from '@/components/ui/Reveal';

// Capabilities documented in the Zinggo plan brochures.
const ROW_A = ['Barcode scanning', 'Batches and expiry', 'Suppliers', 'Stock purchases', 'Customer credit', 'Daily expenses', 'Fixed or % discounts', 'Manual tax'];
const ROW_B = ['Payment references', 'Cash drawer', 'Returns and refunds', 'Invoice reprint', 'QR ordering', 'Delivery riders', 'Menus and recipes', 'Loyalty program', 'Promo codes', 'Customer reviews', 'Advanced reports'];

function Row({ words, dir }: { words: string[]; dir: 'l' | 'r' }) {
  const loop = [...words, ...words];
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className={dir === 'l' ? 'marquee-l' : 'marquee-r'}>
        {loop.map((w, i) => (
          <span key={i} className={`mx-6 whitespace-nowrap text-[clamp(40px,7vw,104px)] font-extrabold leading-[1.1] tracking-[-0.045em] ${i % 2 === 0 ? 'text-night' : 'text-outline text-night/70'}`}>
            {w}
            <span className="mx-6 inline-block h-3 w-3 rounded-full bg-night align-middle" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section id="box" aria-labelledby="box-title" className="on-light marquee relative -mt-10 overflow-hidden rounded-t-[40px] bg-cream py-24 sm:py-32">
      <Reveal className="mx-auto mb-14 max-w-7xl px-5 sm:px-8">
        <p className="t-eyebrow text-brand-ink">Everything in the box</p>
        <h2 id="box-title" className="t-section mt-4 max-w-3xl">The small things that run a business.</h2>
      </Reveal>
      <div className="space-y-2">
        <Row words={ROW_A} dir="l" />
        <Row words={ROW_B} dir="r" />
      </div>
      <Reveal className="mx-auto mt-14 max-w-7xl px-5 sm:px-8">
        <p className="max-w-xl border-t border-night/20 pt-6 text-[15px] leading-relaxed text-night/75">Payments are recorded, not processed. Zinggo notes cash, Easypaisa, JazzCash and bank payment references against each sale. It is not a bank, wallet or payment gateway.</p>
      </Reveal>
      <ul className="sr-only">{[...ROW_A, ...ROW_B].map((w) => <li key={w}>{w}</li>)}</ul>
    </section>
  );
}
