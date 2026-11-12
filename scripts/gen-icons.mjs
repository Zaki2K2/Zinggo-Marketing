// Generates every brand derivative from the official source files in brand-src/ (the sources are never modified).
//   node scripts/gen-icons.mjs
// Uses the locally installed Edge/Chromium canvas for resampling, so no image library is needed.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const EDGE = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const TEAL = '#00CCC0';
const logoSrc = readFileSync('brand-src/Logo-Zinggo.png').toString('base64');
const iconSrc = readFileSync('brand-src/Zinggo-Icon-white.png').toString('base64');
mkdirSync('public/brand', { recursive: true });

const b = await chromium.launch({ executablePath: EDGE, headless: true });
const page = await b.newPage();
await page.setContent('<body></body>');

/** Runs in the page: returns data URLs for the requested renders. */
const out = await page.evaluate(async ({ logoSrc, iconSrc, TEAL }) => {
  const load = async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); return i; };
  const bboxOf = (img) => {
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; return [c, g]; };
  // progressive halving keeps small sizes crisp instead of aliased
  const shrink = (src, tw, th) => {
    let cur = src;
    while (cur.width / 2 >= tw && cur.height / 2 >= th) { const [c, g] = mk(Math.round(cur.width / 2), Math.round(cur.height / 2)); g.drawImage(cur, 0, 0, c.width, c.height); cur = c; }
    const [c, g] = mk(tw, th); g.drawImage(cur, 0, 0, tw, th); return c;
  };

  const logo = await load(logoSrc);
  const icon = await load(iconSrc);
  const lb = bboxOf(logo);
  const ib = bboxOf(icon);
  const res = { logoBox: lb, iconBox: ib };

  // 1) Wordmark, cropped to its artwork (transparent, white), original proportions
  { const [c, g] = mk(lb.w, lb.h); g.drawImage(logo, lb.x, lb.y, lb.w, lb.h, 0, 0, lb.w, lb.h); res.logo = c.toDataURL('image/png'); res.logoSize = [lb.w, lb.h]; }

  // 2) Solid-teal icons with the symbol centred at its original proportions.
  //    widthFrac = share of the canvas width taken by the symbol (the rest is padding).
  const MASTER = 2048;
  const symbolOn = (size, widthFrac) => {
    // render big, then shrink, for the best small-size quality
    const [m, g] = mk(MASTER, MASTER);
    g.fillStyle = TEAL; g.fillRect(0, 0, MASTER, MASTER);
    const w = MASTER * widthFrac; const h = w * (ib.h / ib.w);
    g.drawImage(icon, ib.x, ib.y, ib.w, ib.h, (MASTER - w) / 2, (MASTER - h) / 2, w, h);
    return size === MASTER ? m : shrink(m, size, size);
  };
  const specs = {
    'favicon-16x16.png': [16, 0.74],
    'favicon-32x32.png': [32, 0.70],
    'favicon-48x48.png': [48, 0.68],
    'apple-touch-icon.png': [180, 0.64],
    'icon-192.png': [192, 0.64],
    'icon-512.png': [512, 0.64],
    // maskable: the whole symbol must sit inside the central 80% circle (diag/2 <= 0.4)
    'icon-maskable-512.png': [512, 0.52],
  };
  res.icons = {};
  for (const [name, [size, frac]] of Object.entries(specs)) res.icons[name] = symbolOn(size, frac).toDataURL('image/png');
  return res;
}, { logoSrc, iconSrc, TEAL });

await b.close();

const save = (path, dataUrl) => writeFileSync(path, Buffer.from(dataUrl.split(',')[1], 'base64'));
save('public/brand/logo-zinggo.png', out.logo);
for (const [name, url] of Object.entries(out.icons)) save(`public/${name}`, url);

// Multi-resolution favicon.ico (PNG-compressed entries: 16, 32, 48)
const frames = [16, 32, 48].map((s) => ({ s, buf: Buffer.from(out.icons[`favicon-${s}x${s}.png`].split(',')[1], 'base64') }));
const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(frames.length, 4);
let offset = 6 + 16 * frames.length;
const dir = frames.map((f) => { const e = Buffer.alloc(16); e[0] = f.s; e[1] = f.s; e[2] = 0; e[3] = 0; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(f.buf.length, 8); e.writeUInt32LE(offset, 12); offset += f.buf.length; return e; });
writeFileSync('public/favicon.ico', Buffer.concat([head, ...dir, ...frames.map((f) => f.buf)]));

console.log('logo artwork', JSON.stringify(out.logoBox), '->', out.logoSize.join('x'));
console.log('symbol artwork', JSON.stringify(out.iconBox));
console.log('written: public/brand/logo-zinggo.png, favicon.ico, ' + Object.keys(out.icons).join(', '));
