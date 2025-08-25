/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // removed so middleware & SSR work
  experimental: {
    optimizeCss: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  // ---- reduce Webpack pack-file cache issues in development ----
  webpack(config, { dev }) {
    if (dev) {
      // disable persistent filesystem cache which is the common cause
      // of "rename ... .pack.gz_" ENOENT errors in some environments
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
