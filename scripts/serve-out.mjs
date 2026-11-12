// Serves the static export (./out) the way a static host would. Usage: npm run preview [port]
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize, resolve, sep } from 'node:path';

const PORT = Number(process.argv[2] || process.env.PORT || 3000);
const ROOT = resolve('out');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2',
};

if (!existsSync(join(ROOT, 'index.html'))) {
  console.error('out/index.html not found. Run: npm run build');
  process.exit(1);
}

http
  .createServer((req, res) => {
    let path = normalize(decodeURIComponent(req.url.split('?')[0]));
    if (path.endsWith('/') || path.endsWith(sep)) path += 'index.html';
    let file = resolve(join(ROOT, path));
    if (file !== ROOT && !file.startsWith(ROOT + sep)) { // never leave out/
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    if (!existsSync(file) || statSync(file).isDirectory()) {
      file = join(ROOT, '404.html');
      res.statusCode = 404;
    }
    res.setHeader('content-type', TYPES[extname(file)] || 'application/octet-stream');
    res.end(readFileSync(file));
  })
  .listen(PORT, () => console.log(`Zinggo static site: http://localhost:${PORT}`));
