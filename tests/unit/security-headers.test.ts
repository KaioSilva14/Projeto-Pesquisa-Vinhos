import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy, buildSecurityHeaders } from "@/config/security-headers";

const production = { isDev: false, isHttps: true };
const localhost = { isDev: false, isHttps: false };

describe("buildContentSecurityPolicy", () => {
  it("bloqueia embutir o site em iframes e plugins", () => {
    const csp = buildContentSecurityPolicy(production);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it("só permite 'unsafe-eval' em desenvolvimento", () => {
    expect(buildContentSecurityPolicy(production)).not.toContain("unsafe-eval");
    expect(buildContentSecurityPolicy({ isDev: true, isHttps: false })).toContain("'unsafe-eval'");
  });

  it("só força HTTPS quando o site roda em HTTPS", () => {
    expect(buildContentSecurityPolicy(production)).toContain("upgrade-insecure-requests");
    expect(buildContentSecurityPolicy(localhost)).not.toContain("upgrade-insecure-requests");
  });
});

describe("buildSecurityHeaders", () => {
  const keys = (options: typeof production) => buildSecurityHeaders(options).map((h) => h.key);

  it("inclui os headers básicos em qualquer ambiente", () => {
    expect(keys(localhost)).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Referrer-Policy",
        "Permissions-Policy",
        "Cross-Origin-Opener-Policy",
      ]),
    );
  });

  it("só envia HSTS com HTTPS", () => {
    expect(keys(production)).toContain("Strict-Transport-Security");
    expect(keys(localhost)).not.toContain("Strict-Transport-Security");
  });
});
