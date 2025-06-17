import { VACCINATIONS_HUB_PAGE_ROUTE } from "@src/app/check-and-book-rsv/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino"],
  transpilePackages: ["react-error-boundary"],
  redirects: () => Promise.resolve([{
    source: '/',
    destination: VACCINATIONS_HUB_PAGE_ROUTE,
    permanent: false,
  }])
};

export default nextConfig;
