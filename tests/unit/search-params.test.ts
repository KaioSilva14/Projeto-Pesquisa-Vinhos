import { describe, expect, it } from "vitest";

import { parseSearchPageParams } from "@/lib/search/params";
import { MAX_QUERY_LENGTH } from "@/lib/search/search";
import { searchHref } from "@/lib/search/url";

describe("parseSearchPageParams", () => {
  it("lê consulta, tipo e página", () => {
    expect(parseSearchPageParams({ q: " malbec ", tipo: "uvas", pagina: "2" })).toEqual({
      q: "malbec",
      kind: "grape",
      page: 2,
    });
  });

  it("usa o padrão quando o parâmetro falta ou é inválido", () => {
    expect(parseSearchPageParams({})).toEqual({ q: "", kind: undefined, page: 1 });
    expect(parseSearchPageParams({ tipo: "garrafas", pagina: "-3" })).toMatchObject({
      kind: undefined,
      page: 1,
    });
    expect(parseSearchPageParams({ pagina: "abc" }).page).toBe(1);
    expect(parseSearchPageParams({ pagina: "1.5" }).page).toBe(1);
  });

  it("parâmetro repetido: vale o primeiro", () => {
    expect(parseSearchPageParams({ q: ["tinto", "branco"] }).q).toBe("tinto");
  });

  it("corta consultas longas demais", () => {
    expect(parseSearchPageParams({ q: "a".repeat(500) }).q).toHaveLength(MAX_QUERY_LENGTH);
  });
});

describe("searchHref", () => {
  it("monta a URL em português e omite o que está no padrão", () => {
    expect(searchHref({})).toBe("/pesquisa");
    expect(searchHref({ q: "tinto francês", page: 1 })).toBe("/pesquisa?q=tinto+franc%C3%AAs");
    expect(searchHref({ q: "malbec", kind: "wine", page: 3 })).toBe(
      "/pesquisa?q=malbec&tipo=vinhos&pagina=3",
    );
  });

  it("volta ao mesmo estado quando lida de novo", () => {
    const state = { q: "barolo", kind: "region" as const, page: 2 };
    const params = Object.fromEntries(new URL(searchHref(state), "https://x").searchParams);
    expect(parseSearchPageParams(params)).toEqual(state);
  });
});
