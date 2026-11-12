import type { ReactNode } from 'react';
import { IconTile, type IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { d } from '@/components/mockup/parts';

type Card = { title: string; text: string; icon: IconName; span: string; tone?: 'teal' | 'dark' | 'light' | 'amber'; visual: ReactNode; dark?: boolean };

const Bars = ({ heights }: { heights: number[] }) => (
  <div className="flex h-full items-end gap-1.5" aria-hidden="true">
    {heights.map((h, i) => (
      <span key={i} className="grow-y flex-1 rounded-t-lg bg-gradient-to-t from-brand to-[#7ff3ec]" style={{ height: `${h}%`, ...d(i * 90) }} />
    ))}
  </div>
);

const CARDS: Card[] = [
  {
    title: 'Sell With Ease',
    text: 'Manage daily sales and create invoices without complicated workflows.',
    icon: 'pos',
    span: 'md:col-span-2',
    visual: (
      <div className="ml-auto w-44 rotate-2 rounded-2xl bg-white p-3 text-[11px] shadow-[0_18px_30px_-16px_rgba(0,0,0,0.35)]" aria-hidden="true">
        <p className="font-extrabold">Invoice #ZG-1042</p>
        {[70, 52, 60].map((w, i) => (
          <div key={i} className="grow-x mt-2 h-1.5 rounded bg-line" style={{ width: `${w}%`, ...d(i * 150) }} />
        ))}
        <p className="mt-3 text-right text-[15px] font-extrabold text-brand-ink">Rs 1,850</p>
      </div>
    ),
  },
  {
    title: 'Track Every Product',
    text: 'Know what’s in stock and keep your inventory organized.',
    icon: 'box',
    span: '',
    visual: (
      <div className="space-y-2" aria-hidden="true">
        {[85, 55, 18].map((w, i) => (
          <div key={i} className="h-2 overflow-hidden rounded-full bg-line">
            <div className={`grow-x h-full rounded-full ${i === 2 ? 'bg-danger' : 'bg-brand'}`} style={{ width: `${w}%`, ...d(i * 160) }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Understand Your Business',
    text: 'Review performance through useful sales and expense reports.',
    icon: 'chart',
    span: 'md:row-span-2',
    tone: 'dark',
    dark: true,
    visual: <Bars heights={[30, 46, 38, 64, 52, 80, 94]} />,
  },
  {
    title: 'Manage Orders Faster',
    text: 'Keep incoming orders and sales activity in one place.',
    icon: 'orders',
    span: '',
    visual: (
      <div className="flex flex-wrap gap-1.5 text-[11px] font-bold" aria-hidden="true">
        {['New 2', 'Preparing 3', 'Ready 1'].map((t, i) => (
          <span key={t} className={`pop-in rounded-full px-2.5 py-1 ${i === 0 ? 'bg-brand text-deep' : 'bg-mist text-ink'}`} style={d(i * 140)}>
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Keep Customers Connected',
    text: 'Manage customer details, credit, and relationships.',
    icon: 'users',
    span: 'md:col-span-2',
    visual: (
      <div className="flex items-center gap-3" aria-hidden="true">
        {['SK', 'AR', 'MH'].map((n, i) => (
          <span key={n} className="pop-in flex items-center gap-2 rounded-full bg-mist py-1 pl-1 pr-3 text-[12px] font-bold" style={d(i * 160)}>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/25 text-[10px] text-brand-ink">{n}</span>
            Rs {[1200, 0, 450][i]}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Simplify Your Payments',
    text: 'Record transactions and payment references clearly.',
    icon: 'wallet',
    span: 'md:col-span-2',
    visual: (
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {['Cash', 'Easypaisa', 'JazzCash', 'Bank'].map((m, i) => (
          <span key={m} className="rounded-full px-3.5 py-1.5 text-[12px] font-bold [animation-duration:8s] [animation-iteration-count:infinite]" style={{ animationName: 'cycle-hl', animationDelay: `${i * 2}s`, background: '#F3F5F4' }}>
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Control Daily Expenses',
    text: 'Track purchases, expenses, and cash activity.',
    icon: 'cash',
    span: '',
    visual: (
      <div className="space-y-1.5 text-[11px] font-semibold" aria-hidden="true">
        {[['Supplier', '−4,200'], ['Rent', '−9,000']].map(([a, b]) => (
          <div key={a} className="flex justify-between rounded-lg bg-mist px-2.5 py-1.5">
            <span>{a}</span>
            <span className="text-danger">{b}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Grow With Confidence',
    text: 'Use better business visibility to support informed decisions.',
    icon: 'trend',
    span: '',
    tone: 'amber',
    visual: (
      <svg viewBox="0 0 120 40" className="h-10 w-full" aria-hidden="true">
        <path pathLength={1} className="draw" d="M2 34 L24 26 L46 30 L68 16 L90 20 L118 4" fill="none" stroke="#0a7a74" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Benefits() {
  return (
    <section id="why-zinggo" aria-labelledby="benefits-title" className="on-light bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="benefits-title" eyebrow="Simplify your everyday" title="Less Hassle. More Growth.">
          Everything you need to manage your business, without the complexity.
        </SectionHeading>

        <ul className="mt-16 grid gap-4 md:grid-cols-4 md:auto-rows-[minmax(230px,auto)]">
          {CARDS.map((c, i) => (
            <Reveal as="li" key={c.title} delay={(i % 4) * 70} className={`${c.span} group`}>
              <article className={`flex h-full flex-col justify-between gap-6 overflow-hidden rounded-card p-6 shadow-soft transition-[transform,box-shadow] duration-300 [transition-timing-function:var(--ease-micro)] hover:-translate-y-1 hover:shadow-lift sm:p-7 ${c.dark ? 'bg-night text-white' : 'border border-line bg-white'}`}>
                <div className="flex items-start justify-between gap-4">
                  <IconTile name={c.icon} tone={c.tone ?? (c.dark ? 'dark' : 'light')} />
                  {!c.dark && c.span.includes('col-span-2') && <div className="hidden min-w-0 flex-1 sm:block">{c.visual}</div>}
                </div>
                {c.dark && <div className="min-h-[120px] flex-1">{c.visual}</div>}
                <div>
                  <h3 className="t-card">{c.title}</h3>
                  <p className={`mt-2 text-[15px] leading-relaxed ${c.dark ? 'text-white/70' : 'text-muted'}`}>{c.text}</p>
                  {!c.dark && !c.span.includes('col-span-2') && <div className="mt-5">{c.visual}</div>}
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
