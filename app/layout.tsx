import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter/index.css';
import './globals.css';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://zinggo.app'),
  title: SITE.title,
  description: SITE.description,
  applicationName: 'Zinggo',
  keywords: ['POS Pakistan', 'inventory management', 'restaurant POS', 'retail software', 'distributor software', 'Zinggo'],
  openGraph: { title: SITE.title, description: SITE.description, siteName: 'Zinggo', type: 'website', locale: 'en_PK' },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#0A081B', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
