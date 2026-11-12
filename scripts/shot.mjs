// Visual QA harness: drives the locally installed Microsoft Edge via playwright-core.
// Usage: node scripts/shot.mjs <baseUrl> <outDir>   (env ONLY=desktop1440,mobile390 to limit viewports)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [, , base = 'http://localhost:3222', out = 'shots'] = process.argv;
const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const VPS = { desktop1920: [1920, 1080], desktop1440: [1440, 900], laptop1280: [1280, 800], tablet768: [768, 1024], mobile390: [390, 844], mobile375: [375, 667] };
const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(VPS);

// [name, selector, fraction through the section's scroll range]
const STOPS = [
  ['01-hero', '#top', 0],
  ['02-hero-scrolled', '#top', 0.35],
  ['03-solutions-a', 'section[aria-labelledby="solutions-stack-title"]', 0.05],
  ['04-solutions-b', 'section[aria-labelledby="solutions-stack-title"]', 0.5],
  ['05-solutions-c', 'section[aria-labelledby="solutions-stack-title"]', 0.95],
  ['06-story-a', '#why-zinggo', 0.08],
  ['07-story-b', '#why-zinggo', 0.4],
  ['08-story-c', '#why-zinggo', 0.9],
  ['09-solutions', '#solutions', 0],
  ['10-restaurant', '#restaurant-title', 0],
  ['11-box', '#box', 0],
  ['12-trust', '#trust', 0],
  ['13-community', '#community', 0],
  ['14-pricing', '#pricing', 0],
  ['15-final', '#get-started', 0],
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const report = [];

for (const name of only) {
  const [w, h] = VPS[name];
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  for (const [label, sel, frac] of STOPS) {
    const y = await page.evaluate(([s, f]) => {
      const el = document.querySelector(s);
      if (!el) return null;
      // pinned sections: use their tall wrapper (first child) when present
      const box = el.firstElementChild && el.firstElementChild.offsetHeight > innerHeight * 2 ? el.firstElementChild : el;
      const top = box.getBoundingClientRect().top + scrollY;
      const span = Math.max(0, box.offsetHeight - innerHeight);
      return Math.round(top + (f === 0 ? -80 : f * span));
    }, [sel, frac]);
    if (y === null) { report.push(`${name} ${label}: selector ${sel} missing`); continue; }
    await page.evaluate((yy) => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, Math.max(0, yy)); }, y);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/${name}-${label}.png` });
  }

  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, H: document.documentElement.scrollHeight }));
  const off = await page.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > W + 1 && r.width > 0 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 6).map((e) => e.tagName + '.' + String(e.className).slice(0, 60) + ' right=' + Math.round(e.getBoundingClientRect().right)); });
  if (m.sw > m.cw) report.push(name + ' offenders: ' + off.join(' || '));
  report.push(`${name}: pageHeight=${m.H} overflowX=${m.sw > m.cw ? `YES (${m.sw} > ${m.cw})` : 'no'} consoleErrors=${errors.length}${errors.length ? ' ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();
console.log(report.join('\n'));
