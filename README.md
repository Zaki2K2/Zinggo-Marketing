# Zinggo marketing website

Single-page marketing site (hero, workflow story, business solutions, features/value, pricing, closing CTA): Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4. No animation libraries; all motion is CSS plus React state.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint       # type-check (tsc --noEmit)
```

## Deploy to Vercel

1. Push the folder to a Git repo and import it at vercel.com/new (framework auto-detected: Next.js), or run `npx vercel` and then `npx vercel --prod`.
2. No environment variables are required.
3. Once the domain is confirmed, update `metadataBase` in `app/layout.tsx`, add a `canonical` alternate, and update `app/sitemap.ts`.

## Where to change things

| What | File |
| --- | --- |
| Design tokens (colours, radii, easing), keyframes, reduced-motion rules | `app/globals.css` |
| Contact details, nav, trial link, legal links | `lib/site.ts` |
| Demo data, state machine and autoplay script | `lib/demo/*` |
| Demo engine (provider, autoplay, manual takeover) | `components/demo/DemoProvider.tsx` |
| Interactive phone and its screens | `components/demo/DemoPhone.tsx`, `components/demo/screens.tsx` |
| Hero (headline, tracker, controls) | `components/hero/*` |
| Connected operations board (reads the same demo state) | `components/sections/OpsBoard.tsx` |
| Business types showcase | `components/sections/Solutions.tsx` |
| Plans and prices (from the brochures) | `components/sections/Pricing.tsx` |

### Placeholders you must replace with real URLs
- **Start Free Trial** currently opens WhatsApp (+92 307 533 6334) with a pre-filled message, since no sign-up URL was provided. Change `trialHref()` in `lib/site.ts`.
- **Sign In** scrolls to the final section, which says to sign in from the Merchant app. Point it to a web sign-in URL if one exists.
- **Privacy Policy / Terms** open a pre-filled email request. Set `url` in `LEGAL_LINKS` when pages exist.
- No app-store links are included because the URLs were not provided.

## Brand assets

Official sources live in `brand-src/` (`Logo-Zinggo.png`, `Zinggo-Icon-white.png`, white on transparent) and are never modified. `npm run brand:icons` regenerates every derivative from them: the cropped wordmark (`public/brand/logo-zinggo.png`), `favicon.ico` (16/32/48), the PNG favicons, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` and the maskable icon, all on the brand colour `#00CCC0`. Icons are declared in `app/layout.tsx` and the web app manifest is `app/manifest.ts`.

## Product photos

Demo menu photos are Pexels images (free for commercial use). Credits are in `public/products/CREDITS.md`; `scripts/gen-products.mjs` crops source photos to the 480px squares in `public/products/`. They are illustrative stand-ins, not any merchant's own photography.

## The live demo

A self-contained simulation: typed data, a reducer-based transaction state machine (no overselling, no empty checkout, no sale without a payment method) and a deterministic script. Nothing is sent anywhere and no real merchant or customer data is used. Autoplay pauses on the first touch and never resumes by itself; Replay or Play restarts from a clean state.

## Visual QA harness

Uses the Microsoft Edge already installed on Windows (no browser download) through `playwright-core`.

```bash
# build to a separate folder so a running `next dev` is not disturbed
NEXT_DIST_DIR=.next-shot npx next build
NEXT_DIST_DIR=.next-shot npx next start -p 3222
npm run qa:shots      # screenshots at 1920/1440/1280/768/390/375, flags horizontal overflow and console errors
npm run qa:interact   # keyboard, reverse scroll, scroll performance and mobile menu checks
```
Set `ONLY=desktop1440,mobile390` to limit viewports and `EDGE_PATH` to use another Chromium.

## QA checklist

1. **Lighthouse**: build and start, then Chrome DevTools > Lighthouse (mobile) on `http://localhost:3000`. Check all four categories.
2. **Real mobile**: test 360x800, 390x844 and 430x932. Hero phone must sit under the CTA; every demo must be usable by touch; no horizontal scroll.
3. **Reduced motion**: DevTools > Rendering > "Emulate prefers-reduced-motion: reduce". The hero demo must not autoplay (use Next/Previous), reveals must be visible, no scroll progress bar.
4. **Keyboard only**: Tab through skip link, nav, mobile menu (Esc closes), hero controls, trust carousel (arrow keys), feature demos, solution tabs (arrow/Home/End), pricing, footer. Focus ring must always be visible.
5. **Slow 3G**: DevTools > Network > Slow 3G, hard reload. Check transfer size, no layout shift, content readable before JS finishes.

All demo data on the page is fictional. The Community section is a clearly labelled concept preview.
