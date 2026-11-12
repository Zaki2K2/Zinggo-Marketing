/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Set NEXT_DIST_DIR to build into a separate folder without disturbing a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: { formats: ['image/avif', 'image/webp'] },
};
export default nextConfig;
