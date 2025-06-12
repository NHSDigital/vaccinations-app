import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino"],
  transpilePackages: ["react-error-boundary"],
};

export default nextConfig;
