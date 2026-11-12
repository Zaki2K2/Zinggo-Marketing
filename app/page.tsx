import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Hero } from '@/components/hero/Hero';
import { DemoProvider } from '@/components/demo/DemoProvider';
import { Marquee } from '@/components/sections/Marquee';
import { Pricing } from '@/components/sections/Pricing';
import { FinalCta } from '@/components/sections/FinalCta';
import { SITE } from '@/lib/site';
import { PLANS } from '@/lib/plans';

// Code-split the interactive below-the-fold sections.
const Solutions = dynamic(() => import('@/components/sections/Solutions').then((m) => m.Solutions));
const StackedCards = dynamic(() => import('@/components/sections/StackedCards').then((m) => m.StackedCards));
const OpsBoard = dynamic(() => import('@/components/sections/OpsBoard').then((m) => m.OpsBoard));

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Zinggo Merchant',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android, iOS',
  description: SITE.description,
  offers: [
    ...PLANS.map((p) => ({ '@type': 'Offer', name: p.name, price: String(p.monthly), priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: String(p.monthly), priceCurrency: 'USD', billingDuration: 'P1M' } })),
  ],
};

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded-full bg-brand px-5 py-3 font-bold text-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <DemoProvider>
      <main id="main">
        <Hero />
        <StackedCards />
        <OpsBoard />
        <Solutions />
        <Marquee />
        <Pricing />
        <FinalCta />
      </main>
      </DemoProvider>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
