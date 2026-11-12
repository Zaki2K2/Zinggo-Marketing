'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Icon, IconTile, type IconName } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const CARDS: { title: string; text: string; icon: IconName; chip: string }[] = [
  { title: 'Clear Transaction Records', text: 'Every sale, discount and return is recorded with its invoice, so you can look back with confidence.', icon: 'receipt', chip: 'Invoices · Returns' },
  { title: 'Organized Inventory', text: 'Products, barcodes, batches and expiry dates live in one tidy catalogue with live stock levels.', icon: 'box', chip: 'Barcodes · Batches' },
  { title: 'Familiar Payment Methods', text: 'Record cash, Easypaisa, JazzCash and bank payment references the way your customers already pay.', icon: 'wallet', chip: 'Cash · Wallets · Bank' },
  { title: 'Practical Business Reporting', text: 'Basic and advanced reports for online and offline orders, daily expenses and purchases, filtered by payment type.', icon: 'chart', chip: 'Sales · Expenses' },
  { title: 'Connected Business Operations', text: 'Sales, stock, suppliers, customers and cash drawer activity work together instead of in separate notebooks.', icon: 'layers', chip: 'One platform' },
];

export function Trust() {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + 16 : 1;
    setIndex(Math.min(CARDS.length - 1, Math.round(el.scrollLeft / step)));
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement;
    el.scrollBy({ left: dir * (first.offsetWidth + 16), behavior: 'smooth' });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByCard(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByCard(-1); }
  };

  return (
    <section id="trust" aria-labelledby="trust-title" className="on-light bg-mist py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="trust-title" eyebrow="Built for business owners" title="Confidence In Every Transaction.">
          Keep your daily operations organized, visible, and easier to manage.
        </SectionHeading>

        <Reveal className="mt-14">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted" aria-live="polite">
              {index + 1} / {CARDS.length}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => scrollByCard(-1)} disabled={edges.start} aria-label="Previous card" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white transition-[transform,opacity] duration-150 active:scale-95 enabled:hover:border-ink disabled:opacity-35">
                <Icon name="chevL" />
              </button>
              <button type="button" onClick={() => scrollByCard(1)} disabled={edges.end} aria-label="Next card" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white transition-[transform,opacity] duration-150 active:scale-95 enabled:hover:border-ink disabled:opacity-35">
                <Icon name="chevR" />
              </button>
            </div>
          </div>

          <div role="region" aria-roledescription="carousel" aria-label="Trust highlights" tabIndex={0} onKeyDown={onKey} className="-mx-5 rounded-card px-5 sm:-mx-8 sm:px-8">
            <ul ref={track} onScroll={sync} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scroll-padding-inline:0]">
              {CARDS.map((c, i) => (
                <li key={c.title} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${CARDS.length}`} className="w-[84%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
                  <article className="flex h-full min-h-[320px] flex-col justify-between rounded-card border border-line bg-white p-7 shadow-soft">
                    <div>
                      <IconTile name={c.icon} tone={i % 2 ? 'dark' : 'teal'} />
                      <h3 className="t-card mt-6">{c.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.text}</p>
                    </div>
                    <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[12px] font-bold text-brand-ink">
                      <Icon name="check" size={14} strokeWidth={2.8} /> {c.chip}
                    </span>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
