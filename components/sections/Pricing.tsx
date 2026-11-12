'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { PLANS, YEARLY_DISCOUNT, yearlyTotal, yearlyMonthly } from '@/lib/plans';
import { SITE, trialHref } from '@/lib/site';

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="on-light relative -mt-10 rounded-t-[40px] bg-aqua py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="t-eyebrow text-brand-ink">Simple pricing</p>
            <h2 id="pricing-title" className="t-section mt-4">Plans that fit your business.</h2>
            <p className="t-body mt-4 max-w-md text-muted">Choose the tools that match the way you work.</p>
          </div>

          <div role="radiogroup" aria-label="Billing period" className="inline-flex w-fit rounded-full bg-white p-1.5 shadow-soft">
            {([[false, 'Monthly'], [true, 'Yearly']] as const).map(([val, label]) => (
              <button
                key={label}
                type="button"
                role="radio"
                aria-checked={yearly === val}
                onClick={() => setYearly(val)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold transition-[background-color,color,transform] duration-200 [transition-timing-function:var(--ease-micro)] active:scale-95 ${yearly === val ? 'bg-night text-white' : 'text-ink hover:bg-mist'}`}
              >
                {label}
                {val && <span className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${yearly ? 'bg-sun text-night' : 'bg-sun/60 text-night'}`}>{YEARLY_DISCOUNT}% off</span>}
              </button>
            ))}
          </div>
        </Reveal>

        <ul className="mt-14 border-b border-ink/15">
          {PLANS.map((p) => (
            <Reveal as="li" key={p.name} className="group border-t border-ink/15 py-10 transition-colors duration-300 hover:bg-white/60 md:px-4">
              <div className="grid gap-6 md:grid-cols-[1fr_1.3fr_auto] md:items-center">
                <div>
                  <h3 className="text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.02] tracking-[-0.04em]">{p.name}</h3>
                  <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{p.blurb}</p>
                  <p className="mt-4 inline-block rounded-full bg-amber px-3.5 py-1.5 text-[13px] font-bold text-deep">{p.trial}</p>
                </div>

                <div>
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span key={`${p.name}-${yearly}`} className="bump text-[clamp(40px,5vw,72px)] font-extrabold leading-none tracking-[-0.05em]">
                      ${yearly ? yearlyMonthly(p.monthly) : p.monthly}
                    </span>
                    <span className="text-[15px] font-semibold text-muted">/ month</span>
                    {yearly && <span className="text-[18px] font-bold text-muted line-through decoration-2">${p.monthly}</span>}
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-night" aria-live="polite">
                    {yearly ? `Billed $${yearlyTotal(p.monthly)} per year · ${YEARLY_DISCOUNT}% off` : `Billed monthly · save ${YEARLY_DISCOUNT}% with yearly`}
                  </p>
                  <p className="mt-3 text-[14.5px] font-bold text-brand-ink">{p.highlights.join(' · ')}</p>
                  <details className="mt-3 text-[14.5px]">
                    <summary className="cursor-pointer font-semibold underline underline-offset-4">What’s included</summary>
                    <ul className="mt-3 space-y-2">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand text-deep"><Icon name="check" size={10} strokeWidth={3.6} /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>

                <a href={trialHref(p.name)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full md:w-auto" aria-label={`Start Free Trial, ${p.name} plan`}>
                  Start Free Trial
                </a>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8 text-[14px] text-muted">
          <p>
            All prices in US dollars. Terms and conditions apply. Larger organization?{' '}
            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Zinggo for a larger organization')}`} className="font-bold text-brand-ink underline underline-offset-4">Get in touch</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
