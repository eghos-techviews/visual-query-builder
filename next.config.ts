import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // suppress hydration mismatches from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
