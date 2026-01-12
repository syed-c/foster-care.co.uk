/** @type {import('next').NextConfig} */
const nextConfig = {
  // Default Next.js configuration for Vercel deployment
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['cdn.example.com'], // Add any image domains if needed
  },
  // Enable trailing slashes if needed for SEO
  // trailingSlash: true,
};

module.exports = nextConfig;