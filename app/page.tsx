import dynamic from 'next/dynamic';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MusicToggle } from '@/components/layout/MusicToggle';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { Hero } from '@/components/hero/Hero';
import { Benefits } from '@/components/sections/Benefits';
import { Pricing } from '@/components/sections/Pricing';
import { FinalCta } from '@/components/sections/FinalCta';
import { SITE } from '@/lib/site';

// Code-split the interactive below-the-fold sections.
const Trust = dynamic(() => import('@/components/sections/Trust').then((m) => m.Trust));
const FeatureShowcase = dynamic(() => import('@/components/sections/FeatureShowcase').then((m) => m.FeatureShowcase));
const WorkflowStory = dynamic(() => import('@/components/sections/WorkflowStory').then((m) => m.WorkflowStory));
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
        <Benefits />
        <Trust />
        <WorkflowStory />
        <FeatureShowcase />
        <Community />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
