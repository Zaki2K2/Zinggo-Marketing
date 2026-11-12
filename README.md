# Zinggo marketing website

Single-page marketing site: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4. No animation libraries; all motion is CSS plus React state.

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
| Hero demo script (steps, timings, captions) | `components/mockup/HeroMockup.tsx` |
| Hero screens | `components/mockup/screens/*` |
| Feature demos | `components/demos/*` |
| Plans and prices (from the brochures) | `components/sections/Pricing.tsx` |

### Placeholders you must replace with real URLs
- **Start Free Trial** currently opens WhatsApp (+92 307 533 6334) with a pre-filled message, since no sign-up URL was provided. Change `trialHref()` in `lib/site.ts`.
- **Sign In** scrolls to the final section, which says to sign in from the Merchant app. Point it to a web sign-in URL if one exists.
- **Privacy Policy / Terms** open a pre-filled email request. Set `url` in `LEGAL_LINKS` when pages exist.
- No app-store links are included because the URLs were not provided.

## QA checklist

1. **Lighthouse**: build and start, then Chrome DevTools > Lighthouse (mobile) on `http://localhost:3000`. Check all four categories.
2. **Real mobile**: test 360x800, 390x844 and 430x932. Hero phone must sit under the CTA; every demo must be usable by touch; no horizontal scroll.
3. **Reduced motion**: DevTools > Rendering > "Emulate prefers-reduced-motion: reduce". The hero demo must not autoplay (use Next/Previous), reveals must be visible, no scroll progress bar.
4. **Keyboard only**: Tab through skip link, nav, mobile menu (Esc closes), hero controls, trust carousel (arrow keys), feature demos, solution tabs (arrow/Home/End), pricing, footer. Focus ring must always be visible.
5. **Slow 3G**: DevTools > Network > Slow 3G, hard reload. Check transfer size, no layout shift, content readable before JS finishes.

All demo data on the page is fictional. The Community section is a clearly labelled concept preview.
