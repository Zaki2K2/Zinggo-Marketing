import { HeroMockup } from '@/components/mockup/HeroMockup';
import { HeroParallax } from './HeroParallax';
import { Icon } from '@/components/ui/Icon';
import { d } from '@/components/mockup/parts';
import { trialHref } from '@/lib/site';

export function Hero() {
  return (
    <HeroParallax labelledBy="hero-title" className="relative isolate overflow-hidden bg-night text-white">
      {/* One purposeful light source, placed behind the phone. No grid, no extra orbs. */}
      <div className="absolute right-[-8%] top-[8%] -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(0,199,190,0.22),transparent_68%)]" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-14 pt-28 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:pb-16 lg:pt-32">
        <div className="lg:pr-4" style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -32px), 0)', opacity: 'calc(1 - var(--hp, 0) * 0.75)' }}>
          <p className="fade-in t-eyebrow mb-6 inline-flex items-center gap-3 text-white/60" style={d(0)}>
            <span className="h-px w-8 bg-brand" aria-hidden="true" />
            One platform. Every business.
          </p>
          <h1 id="hero-title" className="text-[clamp(40px,5vw,78px)] font-extrabold leading-[0.98] tracking-[-0.05em]">
            <span className="line-mask"><span style={d(80)}>Run Your Business.</span></span>
            <span className="line-mask"><span style={d(180)}>All in <span className="text-brand">Zinggo.</span></span></span>
          </h1>
          <p className="slide-up t-body mt-6 max-w-[30ch] text-white/65 sm:max-w-md" style={d(380)}>Sales, stock, orders and customers, running together in one app.</p>

          <div className="slide-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={d(480)}>
            <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full px-8 sm:w-auto">
              Start Free Trial <Icon name="arrow" size={18} strokeWidth={2.4} />
            </a>
            <a href="#how-it-works" className="btn btn-ghost w-full sm:w-auto">
              Watch it work
            </a>
          </div>
          <p className="fade-in mt-5 text-[13px] text-white/45" style={d(650)}>From Rs 999/month · Free trial included · Terms and conditions apply</p>
        </div>

        <div id="how-it-works" className="scroll-mt-24" style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -64px), 0) scale(calc(1 - var(--hp, 0) * 0.07))', transformOrigin: '50% 30%' }}>
          <h2 className="sr-only">Watch Zinggo run your business</h2>
          <div className="product-in [perspective:1200px]" style={d(250)}>
            <HeroMockup />
          </div>
        </div>
      </div>
    </HeroParallax>
  );
}
