import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  matcher: ["/transactions", "/analytics"],
};

export default nextConfig;
