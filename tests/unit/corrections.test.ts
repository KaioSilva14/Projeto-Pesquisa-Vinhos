import { describe, expect, it } from "vitest";

import {
  buildCorrectionIssueUrl,
  CORRECTION_LIMITS,
  isInternalPath,
  validateCorrection,
} from "@/lib/corrections/correction";
import { HOME_FAQ } from "@/config/faq";
import { homeJsonLd } from "@/lib/seo/home";

// Sugerir uma correção (ADR-031): só monta a issue; dados fictícios
const valid = {
  page: "/vinhos/vinho-exemplo-01",
  problem: "O texto diz safra 2019, mas a ficha técnica diz 2020.",
  source: "https://example.org/ficha-tecnica.pdf",
};

describe("validateCorrection", () => {
  it("aceita uma sugestão completa (fonte é opcional)", () => {
    expect(validateCorrection(valid)).toEqual({});
    expect(validateCorrection({ ...valid, source: "" })).toEqual({});
  });

  it("mensagens dizem o que fazer, com exemplo", () => {
    const errors = validateCorrection({ page: "", problem: "curto", source: "ftp://x" });
    expect(errors.page).toMatch(/Informe a página.*\/vinhos\//);
    expect(errors.problem).toMatch(/pelo menos 20 caracteres/);
    expect(errors.source).toMatch(/https:\/\/.*deixe em branco/);
  });

  it("página precisa ser um caminho do próprio Vinum", () => {
    for (const page of ["https://outro.site/x", "vinhos/x", "//evil.example", "/vinhos/<script>"]) {
      expect(validateCorrection({ ...valid, page }).page).toBeDefined();
    }
    expect(isInternalPath("/uvas/malbec")).toBe(true);
  });

  it("limita o tamanho do texto", () => {
    const problem = "a".repeat(CORRECTION_LIMITS.problem.max + 1);
    expect(validateCorrection({ ...valid, problem }).problem).toMatch(/passou de 1000/);
  });
});

describe("buildCorrectionIssueUrl", () => {
  it("monta uma issue nova no repositório, com título e texto", () => {
    const url = new URL(buildCorrectionIssueUrl(valid, "https://github.com/exemplo/repo"));
    expect(url.origin + url.pathname).toBe("https://github.com/exemplo/repo/issues/new");
    expect(url.searchParams.get("title")).toBe("Correção de dados: /vinhos/vinho-exemplo-01");
    expect(url.searchParams.get("body")).toContain(valid.problem);
    expect(url.searchParams.get("body")).toContain(valid.source);
  });
});

describe("perguntas frequentes", () => {
  it("são 5, e as mesmas vão para o FAQPage", () => {
    expect(HOME_FAQ).toHaveLength(5);
    const graph = homeJsonLd("https://vinum.example", HOME_FAQ)["@graph"] as {
      "@type": string;
      mainEntity?: { name: string }[];
    }[];
    const faq = graph.find((item) => item["@type"] === "FAQPage");
    expect(faq?.mainEntity?.map((question) => question.name)).toEqual(
      HOME_FAQ.map((item) => item.question),
    );
  });
});
