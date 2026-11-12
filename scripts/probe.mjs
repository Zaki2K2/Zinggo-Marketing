// Interaction QA: reverse scroll, keyboard, mobile menu, vote API.
import { chromium } from 'playwright-core';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.argv[2] || 'http://localhost:3222';
const OUT = process.argv[3] || 'shots/interact';
import { mkdirSync } from 'node:fs';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: EDGE, headless: true });
const log = [];

// ---- Desktop
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);

  // Hero keyboard: focus the carousel and press ArrowRight twice
  const car = p.locator('[aria-roledescription="carousel"]');
  const before = await p.locator('[aria-current="true"] .label').first().innerText().catch(() => '?');
  await car.focus();
  await p.keyboard.press('ArrowRight');
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(500);
  const after = await p.locator('ol [aria-current="true"] .label').first().innerText().catch(() => '?');
  log.push(`hero carousel keyboard: ${before} -> ${after}`);

  // Story reverse scroll
  const story = await p.evaluate(() => {
    const s = document.querySelector('#why-zinggo');
    const w = s.firstElementChild;
    const top = w.getBoundingClientRect().top + scrollY;
    return { top, span: w.offsetHeight - innerHeight };
  });
  const at = async (f) => { await p.evaluate((y) => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, y); }, story.top + f * story.span); await p.waitForTimeout(1300); };
  const cur = () => p.evaluate(() => document.querySelector('#why-zinggo [aria-current="step"]')?.textContent?.trim());
  await at(0.1); const a = await cur();
  await at(0.9); const bb = await cur();
  await p.screenshot({ path: `${OUT}/story-forward-end.png` });
  await at(0.1); const c = await cur();
  await p.screenshot({ path: `${OUT}/story-reverse-start.png` });
  log.push(`story steps: 0.1=>"${a}" 0.9=>"${bb}" back 0.1=>"${c}" (reverse ${a === c ? 'OK' : 'MISMATCH'})`);

  // Solutions stack reverse
  const sol = await p.evaluate(() => {
    const s = document.querySelector('section[aria-labelledby="solutions-stack-title"]');
    const w = s.firstElementChild;
    return { top: w.getBoundingClientRect().top + scrollY, span: w.offsetHeight - innerHeight };
  });
  const sat = async (f) => { await p.evaluate((y) => scrollTo(0, y), sol.top + f * sol.span); await p.waitForTimeout(1500); };
  const scur = () => p.evaluate(() => document.querySelector('section[aria-labelledby="solutions-stack-title"] [aria-current="true"]')?.textContent?.trim());
  await sat(0); const s0 = await scur();
  await sat(1); const s1 = await scur();
  await p.screenshot({ path: `${OUT}/solutions-end.png` });
  await sat(0.5); const s2 = await scur();
  await p.screenshot({ path: `${OUT}/solutions-back-mid.png` });
  log.push(`solutions stack: start="${s0}" end="${s1}" back-mid="${s2}"`);

  // Vote API
  const v = await p.evaluate(async () => {
    const g = await (await fetch('/api/stories/votes')).json();
    const r = await fetch('/api/stories/votes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: 's1' }) });
    const bad = await fetch('/api/stories/votes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: 'nope' }) });
    return { get: g.votes, post: r.status, bad: bad.status };
  });
  log.push(`vote api: ${JSON.stringify(v)}`);
  log.push(`desktop page errors: ${errors.length}`);
  await ctx.close();
}

// ---- Mobile menu
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.getByRole('button', { name: 'Open menu' }).click();
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/mobile-menu.png` });
  await p.getByRole('link', { name: 'Pricing' }).first().click();
  await p.waitForTimeout(900);
  const y = await p.evaluate(() => scrollY);
  const menuOpen = await p.getByRole('button', { name: 'Close menu' }).count();
  log.push(`mobile menu: Pricing link scrolled to y=${Math.round(y)}, menu still open=${menuOpen > 0}`);
  await ctx.close();
}

await b.close();
console.log(log.join('\n'));
