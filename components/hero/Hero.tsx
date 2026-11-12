import { HeroMockup } from '@/components/mockup/HeroMockup';
import { Icon } from '@/components/ui/Icon';
import { trialHref } from '@/lib/site';

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-night text-white">
      {/* depth: geometric forms + soft light, kept behind content */}
      <div className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]" aria-hidden="true" />
      <div className="absolute -right-40 -top-40 -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(0,199,190,0.28),transparent_65%)]" aria-hidden="true" />
      <div className="absolute -left-24 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,199,190,0.12),transparent_70%)]" aria-hidden="true" />
      <div className="absolute right-[8%] top-[18%] -z-10 hidden h-40 w-40 rotate-12 rounded-[36px] border border-white/10 lg:block" aria-hidden="true" />
      <div className="absolute bottom-[14%] left-[46%] -z-10 hidden h-24 w-24 -rotate-12 rounded-full border border-brand/20 lg:block" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24 lg:pt-36">
        <div>
          <p className="t-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden="true" />
            One platform. Every business.
          </p>
          <h1 id="hero-title" className="t-hero">
            Run Your Entire Business. With <span className="text-brand">Zinggo.</span>
          </h1>
          <p className="t-body mt-6 max-w-xl text-white/75">Manage sales, inventory, orders, customers, and daily operations — all from one powerful platform.</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
              Start Free Trial <Icon name="arrow" size={18} strokeWidth={2.4} />
            </a>
            <a href="#how-it-works" className="btn btn-ghost w-full sm:w-auto">
              See How It Works
            </a>
          </div>
          <p className="mt-5 text-[14px] text-white/55">Plans from Rs 999/month · Free trial included · Terms and conditions apply</p>
        </div>

        <div id="how-it-works" className="scroll-mt-24">
          <h2 className="sr-only">Watch Zinggo run your business</h2>
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
