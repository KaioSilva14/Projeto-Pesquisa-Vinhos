import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Não anunciar a versão do framework no header "X-Powered-By" (SECURITY.md)
  poweredByHeader: false,
};

export default nextConfig;
