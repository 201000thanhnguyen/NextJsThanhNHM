import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL?.trim()

    // Local dev: proxy to NestJS so FE can call /api/* and still get cookies.
    // Production: leave it empty because nginx will reverse-proxy.
    if (!apiBaseUrl) return []

    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
