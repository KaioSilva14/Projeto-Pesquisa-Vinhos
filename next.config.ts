import type { NextConfig } from "next";

import { buildSecurityHeaders } from "./src/config/security-headers";

const securityHeaders = buildSecurityHeaders({
  isDev: process.env.NODE_ENV === "development",
  // A Vercel define VERCEL=1 nos builds dela, onde o site sempre é servido em HTTPS
  isHttps: process.env.VERCEL === "1",
});

const nextConfig: NextConfig = {
  // Não anunciar a versão do framework no header "X-Powered-By" (SECURITY.md)
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
