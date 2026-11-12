import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { trialHref } from '@/lib/site';

const WORDS = ['Order', 'Sale', 'Stock', 'Report'];

function Band({ dir }: { dir: 'l' | 'r' }) {
  const loop = [...WORDS, ...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className={dir === 'l' ? 'marquee-l' : 'marquee-r'} style={{ animationDuration: '90s' }}>
        {loop.map((w, i) => (
          <span key={i} className="mx-5 whitespace-nowrap text-[clamp(90px,15vw,230px)] font-extrabold leading-[0.95] tracking-[-0.06em] text-night/[0.1]">
            {w}<span className="mx-5 inline-block h-5 w-5 rounded-full bg-night/[0.1] align-middle" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function FinalCta() {
  return (
    <section id="get-started" aria-labelledby="cta-title" className="on-light relative isolate -mt-10 overflow-hidden rounded-t-[40px] bg-brand py-28 text-night sm:py-40">
      {/* the workflow, as giant quiet type */}
      <div className="absolute inset-0 -z-10 flex flex-col justify-center gap-2" aria-hidden="true">
        <Band dir="l" />
        <Band dir="r" />
      </div>

      <Reveal className="relative z-10 mx-auto max-w-4xl px-5 text-center">
        <p className="t-eyebrow text-night/75">Ready when you are</p>
        <h2 id="cta-title" className="mt-5 text-[clamp(40px,6.4vw,104px)] font-extrabold leading-[0.94] tracking-[-0.055em]">Your business.<br />Your future.<br />Your <span className="sr-only">Zinggo</span><span className="zg-word" style={{ background: 'var(--color-night)' }} aria-hidden="true" />.</h2>
        <p className="t-body mx-auto mt-7 max-w-md text-night/85">Sell smarter, manage better, and take your business forward with one connected platform.</p>
        <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10 px-10 py-5 text-[17px] !bg-sun !text-night hover:!bg-[#f0c53f]">Start Free Trial <Icon name="arrow" size={20} strokeWidth={2.4} /></a>
        <p className="mt-6 text-[14px] font-medium text-night/80">Already a merchant? Sign in from the Zinggo Merchant app on your phone.</p>
      </Reveal>
    </section>
  );
}
