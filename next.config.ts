import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On Vercel, use default .next directory expected by the edge platform. Locally, use .output.
  distDir: process.env.VERCEL ? undefined : '.output',
  output: process.env.DOCKER_BUILD === '1' ? 'standalone' : undefined,
};

export default nextConfig;
