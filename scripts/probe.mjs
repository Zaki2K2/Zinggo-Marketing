// Interaction QA for the live demo: autoplay, manual takeover, state consistency, oversell guard, scroll performance, mobile.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.argv[2] || 'http://localhost:3222';
const OUT = process.argv[3] || 'shots/interact';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: EDGE, headless: true });
const log = [];
const ok = (cond, msg) => log.push(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);

// ---------- Desktop ----------
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(BASE, { waitUntil: 'domcontentloaded' });

  // Entrance choreography frames
  for (const [t, name] of [[500, 'a-0.5s'], [700, 'b-1.2s'], [900, 'c-2.1s']]) { await p.waitForTimeout(t); await p.screenshot({ path: `${OUT}/hero-${name}.png` }); }

  // Phone fully inside first viewport?
  const box = await p.locator('.demo-stage').first().boundingBox();
  ok(box && box.y >= 0 && box.y + box.height <= 900, `hero phone fully in first viewport at 1440x900 (y=${Math.round(box?.y)}, h=${Math.round(box?.height)})`);

  // Autoplay: sample the active tab for ~39s
  const seq = [];
  for (let i = 0; i < 26; i++) {
    const tab = await p.locator('.demo-stage nav [aria-current="page"]').first().innerText().catch(() => '?');
    if (seq[seq.length - 1] !== tab.trim()) seq.push(tab.trim());
    if (i === 8) await p.screenshot({ path: `${OUT}/hero-autoplay-a.png` });
    if (i === 14) await p.screenshot({ path: `${OUT}/hero-autoplay-b.png` });
    await p.waitForTimeout(1500);
  }
  log.push(`autoplay tab sequence: ${seq.join(' > ')}`);
  ok(['Home', 'POS', 'Catalog', 'Orders', 'Reports'].every((t) => seq.includes(t)), 'autoplay visits Home, POS, Catalog, Orders and Reports');

  // Manual takeover: reset first, then act as a user
  await p.getByRole('button', { name: 'Run a sale' }).first().click({ force: true });
  await p.waitForTimeout(400);
  const phone = p.locator('.demo-stage').first();
  const t = (sel) => phone.locator(`[data-demo="${sel}"]`);
  await t('tab-pos').click();
  await p.waitForTimeout(300);
  ok((await p.locator('text=Your turn').count()) > 0, 'first touch hands control to the visitor (announced to screen readers)');
  await t('product-biryani').click();
  await t('sheet-plus').click();
  await t('sheet-add').click();
  await t('add-burger').click();
  await t('add-lemonade').click();
  await t('add-lemonade').click();
  for (let i = 0; i < 7; i++) await t('add-fries').click({ force: true }).catch(() => {});
  const friesBadge = await phone.locator('article:has-text("Masala Fries") span.pop-in').first().innerText().catch(() => '?');
  ok(friesBadge.trim() === '4', `cannot add more than stock (fries in cart = ${friesBadge.trim()}, stock 4)`);
  await t('cart-bar').click();
  await p.waitForTimeout(300);
  for (let i = 0; i < 4; i++) await phone.getByRole('button', { name: 'Decrease Masala Fries' }).click();
  const checkoutText = await phone.innerText();
  ok(checkoutText.includes('Rs 1,850'), 'checkout total after adjusting quantities = Rs 1,850');
  await t('pay-jazzcash').click();
  await t('complete').click();
  await p.waitForTimeout(500);
  const receipt = await phone.innerText();
  ok(receipt.includes('Sale Completed!') && receipt.includes('JC-88231') && receipt.includes('#ZG-1042'), 'sale completes with invoice, order #ZG-1042 and reference JC-88231');
  await p.screenshot({ path: `${OUT}/hero-manual-receipt.png` });
  await t('tab-catalog').click();
  await p.waitForTimeout(500);
  const cat = await phone.innerText();
  ok(/Chicken Biryani[\s\S]*?22/.test(cat) && /Zinger Burger[\s\S]*?17/.test(cat) && /Mint Lemonade[\s\S]*?38/.test(cat), 'catalog shows biryani 22, burger 17, lemonade 38');
  await t('tab-orders').click();
  await p.waitForTimeout(500);
  ok((await phone.innerText()).includes('#ZG-1042'), 'sales history lists the new order');
  await t('tab-reports').click();
  await p.waitForTimeout(500);
  const rep = await phone.innerText();
  ok(rep.includes('Rs 26,700') && rep.includes('39'), 'reports show Rs 26,700 and 39 orders');
  await p.screenshot({ path: `${OUT}/hero-manual-reports.png` });
  await p.waitForTimeout(6000);
  ok((await phone.innerText()).includes('Reports'), 'autoplay does not resume after manual takeover (still on Reports after 6s)');

  // Shared state: the operations board mirrors the same sale
  await p.evaluate(() => document.querySelector('#why-zinggo')?.scrollIntoView());
  await p.waitForTimeout(1200);
  const board = await p.locator('#why-zinggo').innerText();
  ok(board.includes('#ZG-1042') && board.includes('Rs 26,700') && board.includes('Reference JC-88231'), 'operations board shows the same sale and totals');
  await p.screenshot({ path: `${OUT}/ops-after-manual.png` });
  await p.waitForTimeout(8000);
  const after = await p.locator('#why-zinggo').innerText();
  ok(after.includes('Live demo'), 'demo quietly resumes by itself ~12s after the last touch');
  await p.evaluate(() => window.scrollTo(0, 0));

  // Scroll down + up: layout shift and slow frames
  await p.evaluate(() => { window.__cls = 0; window.__slow = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); let last = performance.now(); const tick = (n) => { if (n - last > 50) window.__slow++; last = n; requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 360) { await p.mouse.wheel(0, 360); await p.waitForTimeout(24); }
  for (let y = H; y > 0; y -= 360) { await p.mouse.wheel(0, -360); await p.waitForTimeout(24); }
  const perf = await p.evaluate(() => ({ cls: Math.round(window.__cls * 1000) / 1000, slowFrames: window.__slow }));
  log.push(`scroll down+up: ${JSON.stringify(perf)} (headless, indicative)`);
  log.push(`desktop page errors: ${errors.length}${errors.length ? ' ' + errors.slice(0, 3).join(' | ') : ''}`);
  await ctx.close();
}

// ---------- Mobile (touch) ----------
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${OUT}/mobile-hero.png` });
  await p.evaluate(() => document.querySelector('.demo-stage')?.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/mobile-phone-centered.png` });
  const box = await p.locator('.demo-stage').first().boundingBox();
  ok(box && box.x >= 0 && box.x + box.width <= 390, `mobile phone fits width (x=${Math.round(box?.x)}, w=${Math.round(box?.width)})`);
  const phone = p.locator('.demo-stage').first();
  await phone.locator('[data-demo="tab-pos"]').tap();
  await phone.locator('[data-demo="add-biryani"]').tap();
  await p.waitForTimeout(500);
  ok((await phone.innerText()).includes('1 item in cart'), 'touch: tap POS tab and add an item works');
  await p.screenshot({ path: `${OUT}/mobile-touch-cart.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  ok(!ov, 'mobile: no horizontal overflow');
  await ctx.close();
}

await b.close();
console.log(log.join('\n'));
