import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';
import { LEGAL_LINKS, NAV_LINKS, SITE, legalHref, trialHref } from '@/lib/site';

const PRODUCT = NAV_LINKS.filter((l) => ['Why Zinggo', 'Solutions', 'Features', 'Pricing'].includes(l.label));

export function Footer() {
  return (
    <footer className="bg-night text-white" aria-label="Site footer">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/65">One platform to run, manage, and grow your business — from the local shop to bigger ambitions.</p>
          <a href={trialHref()} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mt-6">Start Free Trial</a>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="t-eyebrow mb-4 text-white/50">Explore</h2>
          <ul className="space-y-3">
            {PRODUCT.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[15px] text-white/85 hover:text-brand">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="text-[15px] text-white/85 hover:text-brand">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div id="contact">
          <h2 className="t-eyebrow mb-4 text-white/50">Contact</h2>
          <ul className="space-y-3 text-[15px]">
            <li>
              <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-white/85 hover:text-brand">
                <Icon name="mail" size={18} /> {SITE.email}
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/85 hover:text-brand">
                <Icon name="chat" size={18} /> {SITE.phone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="t-eyebrow mb-4 text-white/50">Legal</h2>
          <ul className="space-y-3">
            {LEGAL_LINKS.map((l) => (
              <li key={l.label}>
                <a href={legalHref(l)} className="text-[15px] text-white/85 hover:text-brand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-[13px] text-white/50 sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Zinggo. All rights reserved.</p>
          <p>Terms and conditions apply. All in-page demo data is fictional.</p>
        </div>
      </div>
    </footer>
  );
}
