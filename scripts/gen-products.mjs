// Crops the licensed source photos to web-sized squares: node scripts/gen-products.mjs <dir with biryani.jpg ...>
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
const DIR = process.argv[2];
const SIZE = 480;
// focal point (0..1) of each photo, used to centre the square crop
const FOCUS = { biryani: [0.5, 0.5], burger: [0.5, 0.5], pasta: [0.5, 0.5], soup: [0.55, 0.5], lemonade: [0.42, 0.5], fries: [0.58, 0.55] };
const b = await chromium.launch({ executablePath: process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
const p = await b.newPage();
await p.setContent('<body></body>');
for (const [name, [fx, fy]] of Object.entries(FOCUS)) {
  const b64 = readFileSync(`${DIR}/${name}.jpg`).toString('base64');
  const out = await p.evaluate(async ({ b64, fx, fy, SIZE }) => {
    const img = new Image(); img.src = 'data:image/jpeg;base64,' + b64; await img.decode();
    const s = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = Math.min(Math.max(0, img.naturalWidth * fx - s / 2), img.naturalWidth - s);
    const sy = Math.min(Math.max(0, img.naturalHeight * fy - s / 2), img.naturalHeight - s);
    let cur = document.createElement('canvas'); cur.width = s; cur.height = s;
    cur.getContext('2d').drawImage(img, sx, sy, s, s, 0, 0, s, s);
    while (cur.width / 2 >= SIZE) { const c = document.createElement('canvas'); c.width = Math.round(cur.width / 2); c.height = c.width; const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(cur, 0, 0, c.width, c.height); cur = c; }
    const f = document.createElement('canvas'); f.width = SIZE; f.height = SIZE; const g = f.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(cur, 0, 0, SIZE, SIZE);
    return f.toDataURL('image/jpeg', 0.82);
  }, { b64, fx, fy, SIZE });
  const buf = Buffer.from(out.split(',')[1], 'base64');
  writeFileSync(`public/products/${name}.jpg`, buf);
  console.log(name, buf.length + 'B');
}
await b.close();
