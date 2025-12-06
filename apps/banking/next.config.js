/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const DASHBOARD_URL = isProd ? 'http://dashboard:3002' : 'http://localhost:3002';

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
        destination: `${DASHBOARD_URL}/transactions/:path*`,
      },
      {
        source: '/analytics/:path*', 
        destination: `${DASHBOARD_URL}/analytics/:path*`,
      },
      // Proxy para APIs do dashboard
      {
        source: '/api/transactions',
        destination: `${DASHBOARD_URL}/api/transactions`,
      },
      {
        source: '/api/transactions/:path*',
        destination: `${DASHBOARD_URL}/api/transactions/:path*`,
      },
      {
        source: '/api/balance',
        destination: `${DASHBOARD_URL}/api/balance`,
      },
      {
        source: '/api/balance/:path*',
        destination: `${DASHBOARD_URL}/api/balance/:path*`,
      },
      // Proxy para assets específicos do dashboard 
      {
        source: '/_next/static/chunks/app/transactions/:path*',
        destination: `${DASHBOARD_URL}/_next/static/chunks/app/transactions/:path*`,
      },
      {
        source: '/_next/static/chunks/app/analytics/:path*',
        destination: `${DASHBOARD_URL}/_next/static/chunks/app/analytics/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
