'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';

const ROWS = [
  ['Clear transaction records', 'Every sale, discount and return, kept with its invoice.'],
  ['Organized inventory', 'Products, barcodes, batches and expiry dates in one place.'],
  ['Familiar payment methods', 'Cash, Easypaisa, JazzCash and bank references, recorded clearly.'],
  ['Practical business reporting', 'Online and offline orders, expenses and purchases, filtered by payment type.'],
  ['Connected operations', 'Sales, stock, suppliers, customers and the cash drawer working together.'],
];

export function TrustEditorial() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: '-42% 0px -42% 0px' },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="trust" aria-labelledby="trust-title" className="relative -mt-10 rounded-t-[40px] bg-deep py-24 text-white sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div>
            <p className="t-eyebrow text-brand">Built for business owners</p>
            <h2 id="trust-title" className="t-section mt-4">Confidence in every transaction.</h2>
          </div>
          <p className="t-body text-white/65">Zinggo records payment references for cash, Easypaisa, JazzCash and bank payments. It is not a bank, wallet or payment gateway.</p>
        </Reveal>

        <ol className="mt-16 border-b border-white/15">
          {ROWS.map(([t, s], i) => (
            <li key={t} ref={(el) => { refs.current[i] = el; }} data-i={i} className={`grid gap-3 border-t border-white/15 py-8 transition-opacity duration-500 [transition-timing-function:var(--ease-panel)] md:grid-cols-[60px_1.5fr_1fr] md:items-center md:py-10 ${i === active ? 'opacity-100' : 'opacity-35'}`}>
              <span className="text-[13px] font-bold text-white/50">0{i + 1}</span>
              <h3 className={`text-[clamp(28px,4.6vw,64px)] font-extrabold leading-[1] tracking-[-0.04em] transition-colors duration-500 ${i === active ? 'text-brand' : 'text-white'}`}>{t}</h3>
              <p className="text-[16px] leading-relaxed text-white/70">{s}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
