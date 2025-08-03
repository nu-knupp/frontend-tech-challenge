/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@banking/shared-types", 
    "@banking/shared-hooks", 
    "@banking/shared-utils", 
    "@banking/shared-components",
    "@banking/shared-services"
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      // Proxy para páginas do dashboard
      {
        source: '/transactions/:path*',
        destination: 'http://localhost:3002/transactions/:path*',
      },
      {
        source: '/analytics/:path*', 
        destination: 'http://localhost:3002/analytics/:path*',
      },
      // Proxy para APIs do dashboard
      {
        source: '/api/transactions',
        destination: 'http://localhost:3002/api/transactions',
      },
      {
        source: '/api/transactions/:path*',
        destination: 'http://localhost:3002/api/transactions/:path*',
      },
      {
        source: '/api/balance',
        destination: 'http://localhost:3002/api/balance',
      },
      {
        source: '/api/balance/:path*',
        destination: 'http://localhost:3002/api/balance/:path*',
      },
      // Proxy para assets específicos do dashboard 
      {
        source: '/_next/static/chunks/app/transactions/:path*',
        destination: 'http://localhost:3002/_next/static/chunks/app/transactions/:path*',
      },
      {
        source: '/_next/static/chunks/app/analytics/:path*',
        destination: 'http://localhost:3002/_next/static/chunks/app/analytics/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
