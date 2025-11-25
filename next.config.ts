import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['https://thanhnhm.uk', 'http://thanhnhm.uk'],
    }
  },
};

export default nextConfig;
