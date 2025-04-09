import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost','lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
