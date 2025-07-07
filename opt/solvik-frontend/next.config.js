@@ .. @@
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'solvik.app', 'images.pexels.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'crypto-js'],
  },
-  output: 'standalone',
+  output: 'export',
  // Remove rewrites for static export
  /*
  */
};

module.exports = nextConfig;