/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    experimental: {
        optimizeCss: false,
        optimizePackageImports: ['lucide-react'],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'pfdcqlsafgszoaovbcvg.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
        // Optimize image loading
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
    },
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: 'https://pfdcqlsafgszoaovbcvg.supabase.co/functions/v1/generate-sitemap',
            },
        ];
    },
    // Bundle optimization
    webpack: (config, { isServer }) => {
        // Reduce bundle size for client-side
        if (!isServer) {
            if (config.optimization) {
                config.optimization.splitChunks = {
                    chunks: 'all',
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            chunks: 'all',
                        },
                    },
                };
            }
        }
        return config;
    },
    // Performance headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(self)',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
            {
                source: '/:path*.(js|css|svg|png|jpg|jpeg|webp|ico|woff|woff2|avif|gif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    // Compression
    compress: true,
    // Trailing slash configuration
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    // React strict mode
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/locations/:region',
                destination: '/locations/england/:region',
                permanent: true,
            },
            {
                source: '/locations/:region/:county',
                destination: '/locations/england/:region/:county',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
