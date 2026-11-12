import { Logo } from '@/components/ui/Logo';
import { LEGAL_LINKS, NAV_LINKS, SITE, legalHref } from '@/lib/site';

const LINKS = NAV_LINKS.filter((l) => ['Why Zinggo', 'Solutions', 'Features', 'Pricing'].includes(l.label));
const link = 'whitespace-nowrap text-white/70 transition-colors duration-150 hover:text-brand';

/** Single-row footer. Wraps into centred lines on smaller screens. */
export function Footer() {
  return (
    <footer className="relative -mt-10 rounded-t-[40px] bg-deep text-white" aria-label="Site footer">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-5 py-8 text-[13px] sm:px-10 lg:justify-between lg:gap-x-5 lg:pr-24">
        <Logo />

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={link}>{l.label}</a>
          ))}
        </nav>

        <div id="contact" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href={`mailto:${SITE.email}`} className={link}>{SITE.email}</a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>{SITE.phone}</a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LEGAL_LINKS.map((l) => (
            <a key={l.label} href={legalHref(l)} className={link}>{l.label}</a>
          ))}
        </div>

        <p className="whitespace-nowrap text-white/45">© {new Date().getFullYear()} Zinggo</p>
      </div>
    </footer>
  );
}
