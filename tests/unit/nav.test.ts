import { describe, expect, it } from "vitest";

import { isActivePath } from "@/config/nav";

describe("isActivePath", () => {
  it("ativa a home só na raiz", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/uvas", "/")).toBe(false);
  });

  it("ativa a seção na própria página e nas subpáginas", () => {
    expect(isActivePath("/uvas", "/uvas")).toBe(true);
    expect(isActivePath("/uvas/exemplo", "/uvas")).toBe(true);
  });

  it("não confunde seções com prefixo parecido", () => {
    expect(isActivePath("/vinhos-raros", "/vinhos")).toBe(false);
    expect(isActivePath("/regioes", "/uvas")).toBe(false);
  });
});
