'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PhoneFrame, type TabId } from '@/components/mockup/PhoneFrame';
import { DashboardScreen } from '@/components/mockup/screens/DashboardScreen';
import { OrderDetailsScreen } from '@/components/mockup/screens/OrderDetailsScreen';
import { CheckoutScreen } from '@/components/mockup/screens/CheckoutScreen';
import { SaleCompleteScreen } from '@/components/mockup/screens/SaleCompleteScreen';
import { InventoryScreen } from '@/components/mockup/screens/InventoryScreen';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

type Step = { eyebrow: string; title: string; text: string; tab: TabId; screen: ReactNode };

const STEPS: Step[] = [
  { eyebrow: '1 · An order arrives', title: 'It lands on your phone.', text: 'New online orders show up the moment they are placed, next to today’s sales.', tab: 'home', screen: <DashboardScreen notify /> },
  { eyebrow: '2 · You open it', title: 'See exactly what to make.', text: 'Customer, items, quantities and total in one clear view.', tab: 'orders', screen: <OrderDetailsScreen /> },
  { eyebrow: '3 · You record payment', title: 'Cash, Easypaisa, JazzCash or bank.', text: 'Pick how they paid and note the reference. Zinggo records it; it does not process the payment.', tab: 'pos', screen: <CheckoutScreen /> },
  { eyebrow: '4 · Invoice ready', title: 'Done. Invoice generated.', text: 'The sale is saved with a receipt you can print or share.', tab: 'pos', screen: <SaleCompleteScreen /> },
  { eyebrow: '5 · Stock follows', title: 'Inventory updates itself.', text: 'Quantities drop automatically, and low stock gets flagged before you run out.', tab: 'catalog', screen: <InventoryScreen /> },
];

export function WorkflowStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const cur = STEPS[active];

  return (
    <section id="workflow" aria-labelledby="workflow-title" className="bg-night py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="workflow-title" tone="dark" eyebrow="One order, start to finish" title="From order to stock count. Without the notebook.">
          Follow a single order through Zinggo.
        </SectionHeading>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <ol className="space-y-6 lg:space-y-0">
            {STEPS.map((s, i) => (
              <li key={s.eyebrow} ref={(el) => { refs.current[i] = el; }} data-i={i} className="lg:flex lg:min-h-[70vh] lg:items-center">
                <Reveal className={`rounded-card border border-white/10 p-6 transition-colors duration-500 sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 ${i === active ? 'bg-white/[0.06] lg:opacity-100' : 'bg-white/[0.02] lg:opacity-40'} lg:transition-opacity`}>
                  <p className="t-eyebrow text-white/60">{s.eyebrow}</p>
                  <h3 className="mt-3 text-[clamp(28px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{s.title}</h3>
                  <p className="t-body mt-4 max-w-md text-white/70">{s.text}</p>
                  <div className="mt-6 flex justify-center lg:hidden">
                    <div className="h-[480px] w-[234px]">
                      <div className="origin-top-left scale-[0.8]">
                        <PhoneFrame tab={s.tab}><div className="absolute inset-0">{s.screen}</div></PhoneFrame>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-24 flex flex-col items-center">
              <PhoneFrame tab={cur.tab}>
                <div key={active} className="screen-enter absolute inset-0">{cur.screen}</div>
              </PhoneFrame>
              <div className="mt-6 flex gap-2" aria-hidden="true">
                {STEPS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-white' : 'w-1.5 bg-white/30'}`} />)}
              </div>
              <p className="sr-only" aria-live="polite">{cur.eyebrow}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
