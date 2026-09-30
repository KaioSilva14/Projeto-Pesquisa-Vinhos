import { describe, expect, it } from "vitest";

import { createSearcher, MAX_QUERY_LENGTH, queryTerms, typoDistance } from "@/lib/search/search";
import type { SearchDocument } from "@/lib/search/types";

// Documentos fictícios: só testam o algoritmo, não afirmam nada sobre vinhos reais.
const documents: SearchDocument[] = [
  {
    id: "wine:exemplo-01",
    kind: "wine",
    name: "Vinho Exemplo 01",
    subtitle: "Produtor Exemplo · França",
    keywords: ["tinto", "Uva Exemplo Tinta", "França", "francês", "francesa"],
    href: "/vinhos/exemplo-01",
  },
  {
    id: "wine:exemplo-02",
    kind: "wine",
    name: "Vinho Exemplo 02",
    subtitle: "Produtor Exemplo · França",
    keywords: ["branco", "Sauvignon Blanc", "França", "francês", "francesa"],
    href: "/vinhos/exemplo-02",
  },
  {
    id: "wine:exemplo-03",
    kind: "wine",
    name: "Vinho Exemplo 03",
    subtitle: "Outro Produtor · Itália",
    keywords: ["tinto", "Uva Exemplo Tinta", "Itália", "italiano", "italiana"],
    href: "/vinhos/exemplo-03",
  },
  {
    id: "grape:sauvignon-blanc",
    kind: "grape",
    name: "Sauvignon Blanc",
    href: "/uvas/sauvignon-blanc",
  },
  { id: "country:fr", kind: "country", name: "França", href: "/paises/franca" },
];

const search = createSearcher(documents);
const idsFor = (query: string) => search(query).map((result) => result.document.id);

describe("queryTerms", () => {
  it("normaliza, remove repetidos e ignora termos de uma letra", () => {
    expect(queryTerms("Tinto  TINTO, d'Asti")).toEqual(["tinto", "asti"]);
  });

  it('ignora palavras genéricas como "vinho" e "de", a menos que só haja elas', () => {
    expect(queryTerms("vinhos tintos de Itália")).toEqual(["tintos", "italia"]);
    expect(queryTerms("vinho")).toEqual(["vinho"]);
  });

  it("limita o tamanho da consulta e o número de termos", () => {
    expect(queryTerms("a".repeat(MAX_QUERY_LENGTH + 50))[0]).toHaveLength(MAX_QUERY_LENGTH);
    expect(queryTerms("aa bb cc dd ee ff gg hh ii jj")).toHaveLength(8);
  });
});

describe("typoDistance", () => {
  it("conta letras trocadas, faltando, sobrando e invertidas", () => {
    expect(typoDistance("malbec", "malbec", 2)).toBe(0);
    expect(typoDistance("malbek", "malbec", 2)).toBe(1);
    expect(typoDistance("nebiolo", "nebbiolo", 2)).toBe(1);
    expect(typoDistance("malbce", "malbec", 2)).toBe(1);
    expect(typoDistance("sauvinhon", "sauvignon", 2)).toBe(2);
  });

  it("para de contar quando passa do limite", () => {
    expect(typoDistance("tinto", "argentino", 1)).toBe(2);
    expect(typoDistance("abc", "xyz", 1)).toBe(2);
  });
});

describe("createSearcher", () => {
  it('tolera erro de digitação: "sauvinhon" encontra Sauvignon Blanc em primeiro', () => {
    expect(idsFor("sauvinhon")[0]).toBe("grape:sauvignon-blanc");
  });

  it('"tinto frances" exige os dois termos: só o tinto francês aparece', () => {
    expect(idsFor("tinto frances")).toEqual(["wine:exemplo-01"]);
  });

  it("ignora acentos e maiúsculas na consulta", () => {
    expect(idsFor("FRANÇA")).toEqual(idsFor("franca"));
    expect(idsFor("franca")).toContain("country:fr");
  });

  it("acertar o nome vale mais que acertar só uma palavra extra", () => {
    expect(idsFor("sauvignon blanc")[0]).toBe("grape:sauvignon-blanc");
    expect(idsFor("sauvignon blanc")).toContain("wine:exemplo-02");
  });

  it("devolve lista vazia para consulta vazia, só espaços ou só pontuação", () => {
    expect(search("")).toEqual([]);
    expect(search("   ")).toEqual([]);
    expect(search("!?-—")).toEqual([]);
  });

  it("não quebra com caracteres especiais nem com entrada gigante", () => {
    expect(() => search("(tinto)*[ ^$ \\ |")).not.toThrow();
    expect(idsFor("(tinto)*[")).toContain("wine:exemplo-01");
    expect(() => search("sauvignon ".repeat(10_000))).not.toThrow();
  });

  it("compara palavra com palavra: um trecho dentro de outra palavra não conta", () => {
    // "tinto" está a 1 letra de "tino", que aparece dentro de "italiano"/"argentino"
    const withDemonym = createSearcher([
      {
        id: "country:ar",
        kind: "country",
        name: "País Exemplo",
        keywords: ["argentino"],
        href: "/x",
      },
    ]);
    expect(withDemonym("tinto")).toEqual([]);
  });

  it("encontra pelo começo da palavra (quem ainda está digitando)", () => {
    expect(idsFor("sauvig")[0]).toBe("grape:sauvignon-blanc");
  });

  it("não tolera erro em termos curtos (3 letras ou menos)", () => {
    expect(search("sau")).not.toEqual([]);
    expect(search("sxu")).toEqual([]);
  });

  it("devolve lista vazia quando nada parece com a consulta", () => {
    expect(search("xylofone")).toEqual([]);
  });

  it("respeita o limite de resultados", () => {
    expect(search("exemplo", 2)).toHaveLength(2);
  });

  it("ordena do mais parecido para o menos parecido", () => {
    const scores = search("exemplo").map((result) => result.score);
    expect(scores).toEqual([...scores].sort((a, b) => a - b));
  });
});
