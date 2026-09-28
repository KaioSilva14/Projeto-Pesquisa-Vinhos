import { describe, expect, it } from "vitest";

import { parseEnv } from "@/config/env";

describe("parseEnv", () => {
  it("usa os padrões quando nada é definido", () => {
    expect(parseEnv({})).toEqual({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_ENABLE_DEMO_DATA: false,
    });
  });

  it("converte o texto 'true' em booleano", () => {
    expect(parseEnv({ NEXT_PUBLIC_ENABLE_DEMO_DATA: "true" }).NEXT_PUBLIC_ENABLE_DEMO_DATA).toBe(
      true,
    );
  });

  it("recusa valores booleanos ambíguos", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_ENABLE_DEMO_DATA: "sim" })).toThrow(/true.*false/);
  });

  it("recusa URL inválida, sem http(s) ou com barra no final", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "vinum" })).toThrow();
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" })).toThrow();
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "https://vinum.example/" })).toThrow(/barra/);
  });

  it("bloqueia dados de demonstração em produção", () => {
    expect(() =>
      parseEnv({ VERCEL_ENV: "production", NEXT_PUBLIC_ENABLE_DEMO_DATA: "true" }),
    ).toThrow(/demonstração/);
  });

  it("permite dados de demonstração em preview", () => {
    expect(
      parseEnv({ VERCEL_ENV: "preview", NEXT_PUBLIC_ENABLE_DEMO_DATA: "true" })
        .NEXT_PUBLIC_ENABLE_DEMO_DATA,
    ).toBe(true);
  });
});
