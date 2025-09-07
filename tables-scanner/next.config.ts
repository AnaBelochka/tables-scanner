import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // all https-domains
      },
      {
        protocol: 'http',
        hostname: '**', // all http-domains and IP
      },
    ],
  },
};

export default nextConfig;
