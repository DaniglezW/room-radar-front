import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/app',
  images: {
    path: '/app/_next/image',
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
