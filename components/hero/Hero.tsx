import { HeroStage } from './HeroStage';
import { HeroParallax } from './HeroParallax';
import { Icon } from '@/components/ui/Icon';
import { d } from '@/components/mockup/parts';
import { trialHref } from '@/lib/site';

/**
 * Hero concept: a centred, oversized headline over a product stage.
 * The stage is a perspective carousel of the real app; the first viewport shows headline, CTA and the top of the app,
 * and scrolling brings the whole device into view.
 */
export function Hero() {
  return (
    <HeroParallax labelledBy="hero-title" className="relative isolate overflow-hidden bg-night text-white">
      {/* single light source behind the stage */}
      <div className="absolute left-1/2 top-[34%] -z-10 h-[760px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(0,199,190,0.2),transparent)]" aria-hidden="true" />

      <div className="mx-auto max-w-[1280px] px-5 pt-28 sm:px-10 md:pt-32">
        <div className="text-center" style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -40px), 0)', opacity: 'calc(1 - var(--hp, 0) * 0.8)' }}>
          <p className="fade-in label mb-6 text-white/55" style={d(0)}>Business platform for merchants in Pakistan</p>
          <h1 id="hero-title" className="mx-auto text-[clamp(44px,7.4vw,124px)] font-extrabold leading-[0.92] tracking-[-0.06em]">
            <span className="line-mask"><span style={d(60)}>Run your business.</span></span>
            <span className="line-mask"><span style={d(160)}>All in <span className="text-brand">Zinggo.</span></span></span>
          </h1>
          <p className="slide-up mx-auto mt-6 max-w-[34ch] text-[clamp(16px,1.4vw,20px)] leading-relaxed text-white/65" style={d(340)}>Sales, stock, orders and customers, running together in one app.</p>
          <div className="slide-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={d(440)}>
            <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full px-9 sm:w-auto">
              Start Free Trial <Icon name="arrow" size={18} strokeWidth={2.4} />
            </a>
            <a href="#why-zinggo" className="btn btn-ghost w-full sm:w-auto">Watch the workflow</a>
          </div>
          <p className="fade-in label mt-5 text-white/40" style={d(600)}>From Rs 999/mo · free trial · T&amp;C apply</p>
        </div>

        <div id="how-it-works" className="mt-10 scroll-mt-20 md:mt-12" style={{ transform: 'translate3d(0, calc(var(--hp, 0) * -48px), 0) scale(calc(1 - var(--hp, 0) * 0.05))', transformOrigin: '50% 0%' }}>
          <h2 className="sr-only">The Zinggo Merchant app</h2>
          <div className="product-in" style={d(260)}>
            <HeroStage />
          </div>
        </div>
      </div>
      <div className="h-16 md:h-24" aria-hidden="true" />
    </HeroParallax>
  );
}
