import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    // Proxy NestJS under same-origin so httpOnly cookies work for route guards.
    // Nest default port in this repo: 3001 (see nestjs-app/src/main.ts)
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ]
  },
}

export default nextConfig
