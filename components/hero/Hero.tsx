import { HeroDemo } from './HeroDemo';
import { HeroParallax } from './HeroParallax';
import { Icon } from '@/components/ui/Icon';
import { d } from '@/components/mockup/parts';
import { trialHref } from '@/lib/site';

/**
 * Hero: headline and CTA on the left, the live interactive Zinggo app on the right.
 * Entrance: layout -> headline/CTA (0.1-0.7s) -> phone (0.8s) -> demo starts (~1.5s after mount).
 */
export function Hero() {
  return (
    <HeroParallax labelledBy="hero-title" className="relative isolate overflow-hidden bg-night text-white">
      {/* one soft light, placed behind the phone */}
      <div className="absolute right-[2%] top-[14%] -z-10 hidden h-[760px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(0,199,190,0.16),transparent)] lg:block" aria-hidden="true" />

      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 pb-14 pt-[88px] sm:px-10 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14 lg:pb-12 lg:pt-24 xl:gap-24">
        <div style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -30px), 0)', opacity: 'calc(1 - var(--hp, 0) * 0.7)' }}>
          <p className="fade-in label mb-5 text-white/55" style={d(100)}>Business platform for merchants in Pakistan</p>
          <h1 id="hero-title" className="text-[clamp(40px,5.2vw,82px)] font-extrabold leading-[0.96] tracking-[-0.055em]">
            <span className="line-mask"><span style={d(180)}>Run your business.</span></span>
            <span className="line-mask"><span style={d(300)}>All in <span className="text-brand">Zinggo.</span></span></span>
          </h1>
          <p className="slide-up mt-6 hidden max-w-[36ch] sm:block text-[clamp(16px,1.35vw,19px)] leading-relaxed text-white/65" style={d(480)}>Sales, stock, orders and customers, running together. Try the real workflow in the app beside you.</p>

          <div className="slide-up mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center" style={d(600)}>
            <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full px-9 sm:w-auto">
              Start Free Trial <Icon name="arrow" size={18} strokeWidth={2.4} />
            </a>
            <a href="#why-zinggo" className="btn btn-ghost w-full sm:w-auto">Explore Zinggo</a>
          </div>
          <p className="fade-in label mt-5 hidden text-white/40 sm:block" style={d(750)}>From Rs 999/mo · free trial · T&amp;C apply</p>

        </div>

        <div id="how-it-works" className="scroll-mt-20" style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -36px), 0) scale(calc(1 - var(--hp, 0) * 0.04))', transformOrigin: '50% 0%' }}>
          <h2 className="sr-only">Interactive Zinggo Merchant demo</h2>
          <HeroDemo />
        </div>
      </div>
    </HeroParallax>
  );
}
