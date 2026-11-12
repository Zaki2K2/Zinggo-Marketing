import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MusicToggle } from '@/components/layout/MusicToggle';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Hero } from '@/components/hero/Hero';
import { Business } from '@/components/sections/Business';
import { Marquee } from '@/components/sections/Marquee';
import { Pricing } from '@/components/sections/Pricing';
import { FinalCta } from '@/components/sections/FinalCta';
import { SITE } from '@/lib/site';

// Code-split the interactive below-the-fold sections.
const SolutionsStack = dynamic(() => import('@/components/sections/SolutionsStack').then((m) => m.SolutionsStack));
const StoryScene = dynamic(() => import('@/components/story/StoryScene').then((m) => m.StoryScene));
const TrustEditorial = dynamic(() => import('@/components/sections/TrustEditorial').then((m) => m.TrustEditorial));
const Community = dynamic(() => import('@/components/sections/Community').then((m) => m.Community));

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Zinggo Merchant',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Android, iOS',
  description: SITE.description,
  offers: [
    { '@type': 'Offer', name: 'Retailer Plan', price: '999', priceCurrency: 'PKR' },
    { '@type': 'Offer', name: 'Restaurant Plan', price: '2499', priceCurrency: 'PKR' },
    { '@type': 'Offer', name: 'Distributor / Wholesaler Plan', price: '4999', priceCurrency: 'PKR' },
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
      <MusicToggle />
      <main id="main">
        <Hero />
        <StoryScene />
        <span id="solutions" className="block scroll-mt-20" />
        <SolutionsStack />
        <Business />
        <Marquee />
        <TrustEditorial />
        <Community />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
