import { NextConfig } from 'next'

const nextConfig: NextConfig = {
 
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Use the service name from docker-compose.yml
        destination: "http://backend:3001/api/:path*", 
      },
    ]
  },
}

module.exports = nextConfig