// Headers de segurança aplicados a todas as rotas (SECURITY.md §3).

type SecurityOptions = {
  /** `next dev` precisa de 'unsafe-eval' para o recarregamento rápido (Fast Refresh). */
  isDev: boolean;
  /** Só com HTTPS de verdade (Vercel). No localhost em HTTP, forçar HTTPS quebra o CSS no Safari. */
  isHttps: boolean;
};

export type Header = { key: string; value: string };

export function buildContentSecurityPolicy({ isDev, isHttps }: SecurityOptions): string {
  const directives = [
    "default-src 'self'",
    // 'unsafe-inline': o Next injeta scripts inline de hidratação; nonce exigiria abrir mão do SSG
    // (SECURITY.md §3, risco R14). Reavaliar na fase 10.
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    // Mapas das regiões e países: imagens do mapa padrão do OpenStreetMap (ADR-033)
    "img-src 'self' data: blob: https://tile.openstreetmap.org",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  if (isHttps) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

export function buildSecurityHeaders(options: SecurityOptions): Header[] {
  const headers: Header[] = [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(options) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
  if (options.isHttps) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }
  return headers;
}
