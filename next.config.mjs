import bundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/core/i18n/request.ts',
});

/** @type {import('next').NextConfig} */
const standaloneOutputEnabled =
  !process.env.VERCEL &&
  (process.env.NEXT_FORCE_STANDALONE === 'true' ||
    process.platform !== 'win32');

const nextConfig = {
  output: standaloneOutputEnabled ? 'standalone' : undefined,
  reactStrictMode: false,
  devIndicators: false,
  allowedDevOrigins: ['*.trycloudflare.com'],
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [60, 70, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.playharmonium.com',
          },
        ],
        destination: 'https://playharmonium.com/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/en' },
        { source: '/keyboard', destination: '/en/keyboard' },
        { source: '/blog', destination: '/en/blog' },
        { source: '/blog/:path*', destination: '/en/blog/:path*' },
        { source: '/about', destination: '/en/about' },
        { source: '/privacy-policy', destination: '/en/privacy-policy' },
        {
          source: '/terms-of-service',
          destination: '/en/terms-of-service',
        },
        { source: '/online-harmonium', destination: '/en/online-harmonium' },
        { source: '/virtual-harmonium', destination: '/en/virtual-harmonium' },
        { source: '/harmonium-notes', destination: '/en/harmonium-notes' },
        { source: '/notes', destination: '/en/notes' },
        { source: '/laptop-harmonium', destination: '/en/laptop-harmonium' },
        { source: '/tutorial', destination: '/en/tutorial' },
        { source: '/songs', destination: '/en/songs' },
        { source: '/songs/:path*', destination: '/en/songs/:path*' },
        { source: '/shruti-box', destination: '/en/shruti-box' },
        { source: '/sign-in', destination: '/en/sign-in' },
        { source: '/sign-up', destination: '/en/sign-up' },
        { source: '/verify-email', destination: '/en/verify-email' },
        { source: '/no-permission', destination: '/en/no-permission' },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/imgs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.mp3',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.wav',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.png',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/preview.png',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      // fs: {
      //   browser: './empty.ts', // We recommend to fix code imports before using this method
      // },
    },
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    // Disable mdxRs for Vercel deployment compatibility with fumadocs-mdx
    ...(process.env.VERCEL ? {} : { mdxRs: true }),
  },
  reactCompiler: true,
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
