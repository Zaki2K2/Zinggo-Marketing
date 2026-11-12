import { HeroMockup } from '@/components/mockup/HeroMockup';
import { HeroParallax } from './HeroParallax';
import { Icon } from '@/components/ui/Icon';
import { d } from '@/components/mockup/parts';
import { trialHref } from '@/lib/site';

export function Hero() {
  return (
    <HeroParallax labelledBy="hero-title" className="relative isolate overflow-hidden bg-night text-white">
      {/* depth: slow-drifting light and fine grid, behind content */}
      <div className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_20%,black,transparent_70%)]" aria-hidden="true" />
      <div className="drift absolute -right-40 -top-40 -z-10 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,rgba(0,199,190,0.3),transparent_65%)]" aria-hidden="true" />
      <div className="drift absolute -left-32 bottom-[-120px] -z-10 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(0,199,190,0.14),transparent_70%)]" style={d(-8000)} aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night to-transparent" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:pb-28 lg:pt-36">
        <div style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -32px), 0)', opacity: 'calc(1 - var(--hp, 0) * 0.75)' }}>
          <p className="fade-in t-eyebrow mb-7 inline-flex items-center gap-2 text-white/70" style={d(0)}>
            <span className="h-px w-8 bg-brand" aria-hidden="true" />
            One platform. Every business.
          </p>
          <h1 id="hero-title" className="text-[clamp(48px,8vw,116px)] font-extrabold leading-[0.9] tracking-[-0.055em]">
            <span className="line-mask"><span style={d(120)}>Run Your</span></span>
            <span className="line-mask"><span style={d(240)}>Entire Business.</span></span>
            <span className="line-mask"><span style={d(360)}>With <span className="text-brand">Zinggo.</span></span></span>
          </h1>
          <p className="slide-up t-body mt-8 max-w-md text-white/70" style={d(600)}>Sales, stock, orders and customers. Running together, in one app.</p>

          <div className="slide-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={d(760)}>
            <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full px-8 py-[18px] sm:w-auto">
              Start Free Trial <Icon name="arrow" size={18} strokeWidth={2.4} />
            </a>
            <a href="#how-it-works" className="btn btn-ghost w-full sm:w-auto">
              Watch it work
            </a>
          </div>
          <p className="fade-in mt-5 text-[14px] text-white/50" style={d(950)}>From Rs 999/month · Free trial included · Terms and conditions apply</p>
        </div>

        <div id="how-it-works" className="scroll-mt-24" style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -64px), 0) scale(calc(1 - var(--hp, 0) * 0.07))', transformOrigin: '50% 30%' }}>
          <h2 className="sr-only">Watch Zinggo run your business</h2>
          <div className="product-in [perspective:1200px]" style={d(350)}>
            <HeroMockup />
          </div>
        </div>
      </div>
    </HeroParallax>
  );
}
