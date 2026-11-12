'use client';

import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';

type Story = { id: string; kind: string; icon: IconName; who: string; place: string; headline: string; quote: string; metric: [string, string]; hue: string; dark: boolean };

// Clearly fictional sample content for a proposed concept.
const STORIES: Story[] = [
  { id: 's1', kind: 'Merchant spotlight', icon: 'store', who: 'Sample: Noor General Store', place: 'Lahore', headline: 'From notebook to neat records.', quote: 'Sample story: A neighbourhood shop moves from handwritten ledgers to organized daily sales and stock.', metric: ['Daily', 'sales in one place'], hue: 'from-[#00C7BE] to-[#008f89]', dark: false },
  { id: 's2', kind: 'Business milestone', icon: 'trend', who: 'Sample: Bite & Brew Café', place: 'Karachi', headline: 'Opening a second counter.', quote: 'Sample story: A café celebrates a busier counter after tidying menus, orders and deliveries.', metric: ['QR', 'dine-in and takeaway'], hue: 'from-[#0f2d2c] to-[#071B1B]', dark: true },
  { id: 's3', kind: 'Community', icon: 'users', who: 'Sample: Merchant meet-up', place: 'Islamabad', headline: 'Merchants sharing what works.', quote: 'Sample story: Owners swap tips on stock counts, supplier orders and customer credit.', metric: ['Together', 'learning from each other'], hue: 'from-[#e6f9f8] to-[#9eeeea]', dark: false },
  { id: 's4', kind: 'Referral interest', icon: 'gift', who: 'Sample: Friends of Zinggo', place: 'Everywhere', headline: 'Bring a fellow merchant along.', quote: 'Sample concept: A way to introduce other business owners. This is not a live program.', metric: ['Concept', 'not yet live'], hue: 'from-[#0A081B] to-[#1d1a3a]', dark: true },
];

const KEY = 'zinggo-story-vote';

export function Community() {
  const [i, setI] = useState(0);
  const [votes, setVotes] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState(false);
  const [mine, setMine] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const s = STORIES[i];
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent('Zinggo Merchant Stories: my story')}&body=${encodeURIComponent('Hi Zinggo,\n\nMy business: \nCity: \nMy story: \n')}`;

  useEffect(() => {
    setMine(localStorage.getItem(KEY));
    const ctrl = new AbortController();
    fetch('/api/stories/votes', { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setVotes(d.votes))
      .catch((e) => { if (e?.name !== 'AbortError') setError(true); });
    return () => ctrl.abort();
  }, []);

  const vote = async () => {
    if (mine || busy) return;
    setBusy(true);
    try {
      const r = await fetch('/api/stories/votes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: s.id }) });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setVotes(d.votes);
      localStorage.setItem(KEY, s.id);
      setMine(s.id);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const count = votes?.[s.id];

  return (
    <section id="community" aria-labelledby="community-title" className="on-light bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="community-title" eyebrow="The Zinggo community" title="Grow Together. Succeed Together.">
          Celebrate the people building businesses, creating opportunities, and moving commerce forward.
        </SectionHeading>

        <Reveal className="mt-14">
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <h3 className="t-card">Zinggo Merchant Stories</h3>
            <p className="rounded-full bg-mist px-4 py-1.5 text-[12px] font-semibold text-muted">Concept preview · fictional samples · vote for the story you’d like to see first</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="Story types">
              {STORIES.map((x, n) => (
                <li key={x.id}>
                  <button type="button" aria-pressed={n === i} onClick={() => setI(n)} className={`flex w-full items-center gap-4 rounded-[22px] border p-4 text-left transition-[transform,border-color,background-color] duration-200 [transition-timing-function:var(--ease-micro)] active:scale-[0.98] ${n === i ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-ink/40'}`}>
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${n === i ? 'bg-brand text-deep' : 'bg-brand-soft text-brand-ink'}`}><Icon name={x.icon} size={20} /></span>
                    <span><span className="block text-[12px] font-bold uppercase tracking-wider opacity-70">{x.kind}</span><span className="block text-[16px] font-extrabold leading-tight">{x.headline}</span></span>
                  </button>
                </li>
              ))}
            </ul>

            <article key={s.id} aria-live="polite" className={`screen-enter relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-card bg-gradient-to-br p-7 sm:p-10 ${s.hue} ${s.dark ? 'text-white' : 'text-deep'}`}>
              <div className="relative">
                <p className="t-eyebrow opacity-75">{s.kind}</p>
                <p className="mt-5 text-[clamp(26px,3.2vw,40px)] font-extrabold leading-[1.08] tracking-[-0.03em]">{s.headline}</p>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed opacity-85">{s.quote}</p>
              </div>
              <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4">
                <div><p className="text-[15px] font-extrabold">{s.who}</p><p className="text-[13px] opacity-75">{s.place}</p></div>
                <div className="flex items-center gap-3">
                  <div className="min-w-[64px] rounded-2xl bg-white/25 px-3 py-2 text-center backdrop-blur" aria-live="polite">
                    {votes === null && !error ? <span className="skeleton block h-6 w-10 rounded-md" aria-label="Loading votes" /> : <p key={count} className="bump text-[20px] font-extrabold leading-none">{error && votes === null ? '–' : count}</p>}
                    <p className="mt-1 text-[11px] font-semibold opacity-80">votes</p>
                  </div>
                  <button type="button" onClick={vote} disabled={busy || !!mine || (votes === null)} aria-pressed={mine === s.id} className="btn btn-sm bg-white text-deep shadow-lg disabled:opacity-60">
                    <Icon name={mine === s.id ? 'check' : 'star'} size={16} strokeWidth={2.4} />
                    {mine === s.id ? 'Voted' : mine ? 'Vote used' : 'Vote'}
                  </button>
                </div>
              </div>
            </article>
          </div>
          {error && <p role="status" className="mt-3 text-center text-[13px] text-danger">Votes could not be loaded right now. Please try again later.</p>}

          <div className="mt-10 text-center">
            <a href={mail} className="btn btn-dark">Share Your Story <Icon name="arrow" size={18} strokeWidth={2.4} /></a>
            <p className="mt-3 text-[13px] text-muted">Opens an email to {SITE.email}. No campaign, reward or contest is currently running; votes are a demo of the concept.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
