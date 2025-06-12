import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/app',
  images: {
    path: '/_next/image',
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
    ],
  },
};

export default nextConfig; 
