import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/app',
  images: {
    path: '/app/_next/image',
    loader: 'default',
  },
};

export default nextConfig; 
