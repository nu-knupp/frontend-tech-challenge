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
};

module.exports = nextConfig;
