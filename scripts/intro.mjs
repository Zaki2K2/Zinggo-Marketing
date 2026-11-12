// QA for the Zinggo intro INSIDE the hero phone: page stays visible, overlay is clipped to the screen,
// plays once for the GIF's real duration, then reveals the live app; demo waits; reduced motion; GIF failure.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.argv[2] || 'http://localhost:3222';
const OUT = process.argv[3] || 'shots/intro-run';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: EDGE, headless: true });
const log = [];
const ok = (c, m) => log.push(`${c ? 'PASS' : 'FAIL'}  ${m}`);

const overlayInfo = (p) => p.evaluate(() => {
  const o = document.querySelector('.phone-intro');
  const s = document.querySelector('.demo-stage');
  if (!o || !s) return { overlay: false };
  const ob = o.getBoundingClientRect();
  const sb = s.getBoundingClientRect();
  const img = o.querySelector('img');
  const ib = img ? img.getBoundingClientRect() : null;
  const cs = getComputedStyle(o);
  return { overlay: true, bg: cs.backgroundColor, opacity: cs.opacity, fading: o.classList.contains('is-fading'), hasImg: !!img, inside: ob.left >= sb.left - 1 && ob.right <= sb.right + 1 && ob.top >= sb.top - 1 && ob.bottom <= sb.bottom + 1, imgInside: !ib || (ib.left >= ob.left - 1 && ib.right <= ob.right + 1 && ib.top >= ob.top - 1 - 400 && ib.bottom <= ob.bottom + 1 + 400), imgW: ib ? Math.round(ib.width) : 0, ovW: Math.round(ob.width) };
});

// ---------- Desktop ----------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const t0 = Date.now();
  await p.goto(BASE, { waitUntil: 'commit' });
  await p.waitForSelector('#hero-title', { state: 'attached' });

  // The page must never be hidden or covered
  const early = await p.evaluate(() => ({ heroBg: getComputedStyle(document.getElementById('top')).backgroundColor, fixedCover: [...document.querySelectorAll('body *')].some((e) => { const c = getComputedStyle(e); const r = e.getBoundingClientRect(); return c.position === 'fixed' && r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9 && c.display !== 'none' && c.visibility !== 'hidden' && e.id !== 'zg-none'; }), h1: !!document.getElementById('hero-title') }));
  ok(early.heroBg === 'rgb(10, 8, 27)' && !early.fixedCover, `homepage visible from the start: hero background ${early.heroBg}, no full-screen cover`);

  const marks = [300, 1300, 2300, 3300, 4300, 5000, 6000];
  const rows = [];
  for (const m of marks) {
    const wait = m - (Date.now() - t0);
    if (wait > 0) await p.waitForTimeout(wait);
    const o = await overlayInfo(p);
    const tab = await p.locator('.demo-stage nav [aria-current="page"]').first().innerText().catch(() => '?');
    rows.push(`${m}ms:${o.overlay ? `intro${o.hasImg ? '+gif' : ''}${o.fading ? ',fading' : ''}` : 'app'}/${tab.trim()}`);
    await p.screenshot({ path: `${OUT}/desktop-${String(m).padStart(5, '0')}.png` });
    if (m === 2300) {
      ok(o.overlay && o.bg === 'rgb(0, 204, 192)', `inside the phone: teal ${o.bg} (= #00CCC0) overlay, opacity ${o.opacity}`);
      ok(o.inside, 'overlay is fully contained within the phone frame');
      ok(o.hasImg && o.imgW <= o.ovW, `GIF fits inside the screen (gif ${o.imgW}px wide in a ${o.ovW}px screen)`);
    }
  }
  log.push('desktop timeline  ' + rows.join('  '));
  const after = await overlayInfo(p);
  ok(!after.overlay, 'after the animation the overlay is removed and the live app is showing');

  // The interactive app still works exactly as before
  const phone = p.locator('.demo-stage').first();
  await phone.locator('[data-demo="tab-pos"]').click();
  await phone.locator('[data-demo="add-biryani"]').click();
  await p.waitForTimeout(300);
  ok((await phone.innerText()).includes('1 item in cart'), 'interactive app works after the intro (tab + add to cart)');
  const cls = await p.evaluate(() => Math.round(window.__cls * 1000) / 1000);
  ok(cls < 0.05, `layout shift across the whole intro + reveal = ${cls}`);
  log.push(`desktop errors: ${errors.length}${errors.length ? ' ' + errors.slice(0, 2).join(' | ') : ''}`);
  await ctx.close();
}

// ---------- Taps during the intro are ignored; demo waits for the intro ----------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'commit' });
  await p.waitForSelector('.demo-stage');
  await p.waitForTimeout(1600);
  await p.locator('.demo-stage').first().click({ position: { x: 150, y: 330 }, force: true });
  await p.waitForTimeout(3600);
  const state = await p.evaluate(() => ({ overlay: !!document.querySelector('.phone-intro'), control: document.body.innerText.includes('Your turn') }));
  ok(!state.overlay && !state.control, 'tap during the intro is ignored (no manual takeover, demo not disturbed)');
  await p.waitForTimeout(6000);
  const tab = await p.locator('.demo-stage nav [aria-current="page"]').first().innerText();
  ok(['POS', 'Home'].includes(tab.trim()), `autoplay starts after the intro (tab: ${tab.trim()})`);
  await ctx.close();
}

// ---------- Mobile ----------
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'commit' });
  await p.waitForSelector('.demo-stage');
  await p.evaluate(() => document.querySelector('.demo-stage').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(2300);
  const o = await overlayInfo(p);
  await p.screenshot({ path: `${OUT}/mobile-intro.png` });
  ok(o.overlay && o.inside && o.imgW <= o.ovW, `mobile: intro inside the phone (overlay ${o.ovW}px, gif ${o.imgW}px)`);
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${OUT}/mobile-after.png` });
  ok(!(await overlayInfo(p)).overlay, 'mobile: intro finished and app revealed');
  ok(!(await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), 'mobile: no horizontal overflow');
  await ctx.close();
}

// ---------- Reduced motion ----------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'commit' });
  await p.waitForSelector('.demo-stage');
  await p.waitForTimeout(400);
  const vis = await p.evaluate(() => { const o = document.querySelector('.phone-intro'); return o ? getComputedStyle(o).display : 'gone'; });
  ok(vis === 'none' || vis === 'gone', `prefers-reduced-motion: no intro (display: ${vis}), app shown at once`);
  await ctx.close();
}

// ---------- GIF fails ----------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.route('**/zinggo-intro.gif*', (r) => r.abort());
  await p.goto(BASE, { waitUntil: 'commit' });
  await p.waitForSelector('.demo-stage');
  await p.waitForTimeout(900);
  const fb = await p.locator('.phone-intro-fallback').count();
  await p.waitForFunction(() => !document.querySelector('.phone-intro'), null, { timeout: 6000 });
  ok(fb === 1, 'GIF blocked: wordmark fallback shown inside the phone, then the app appears');
  await ctx.close();
}

await b.close();
console.log(log.join('\n'));
