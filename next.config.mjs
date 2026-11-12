/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Static export: `npm run build` writes a plain HTML/CSS/JS site into ./out (index.html at its root),
  // ready for Cloudflare Pages, Netlify, S3 or any static host. No Node server is needed.
  output: 'export',
  // Set NEXT_DIST_DIR to build into a separate folder without disturbing a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // The Next.js image optimiser needs a server, so images are served as-is (they are already compressed).
  images: { unoptimized: true },
};
export default nextConfig;
