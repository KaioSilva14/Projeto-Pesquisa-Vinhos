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
  images: {
    // AVIF primeiro (menor), WebP como alternativa (IMAGES.md §4)
    formats: ["image/avif", "image/webp"],
    // Qualidade 85 (padrão 75): rótulos e texturas ficam nítidos (IMAGES.md §4)
    qualities: [85],
    // Fotos raramente mudam: 31 dias de cache das versões otimizadas (ARCHITECTURE.md §10)
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // Sem origens remotas: todas as imagens ficam em public/images (ADR-013)
    // Só no build dos testes E2E (VINUM_E2E=1, definido pelo Playwright): fotos sem otimização.
    // Converter cada foto para AVIF no servidor "frio" dos testes estourava o tempo no CI; a
    // otimização real é medida pelo Lighthouse CI no build normal (ADR-034).
    unoptimized: process.env.VINUM_E2E === "1",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
