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
  output: 'standalone',
};

module.exports = nextConfig;