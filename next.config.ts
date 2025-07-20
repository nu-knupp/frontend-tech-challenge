import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  matcher: ["/transactions", "/analytics"],
};

export default nextConfig;
