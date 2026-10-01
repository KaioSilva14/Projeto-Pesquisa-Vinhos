import { describe, expect, it } from "vitest";

import { validateCatalog } from "@/lib/validation/validate-catalog";
import { emptyCatalog, type Catalog } from "@/schemas/catalog";

import { base, exampleSource } from "../fixtures/entities";
import { exampleImage } from "../fixtures/images";

const src = { sourceIds: ["src-teste-01"] as [string] };
const today = new Date("2026-09-28");

/** Catálogo fictício e coerente: cada teste quebra uma regra de propósito. */
function validCatalog(): Catalog {
  return {
    ...emptyCatalog(),
    sources: [exampleSource],
    images: [{ ...exampleImage, subjectId: "uva-exemplo" }],
    countries: [{ ...base, id: "xx", slug: "pais-exemplo", name: "País Exemplo" }],
    regions: [
      {
        ...base,
        id: "regiao-a",
        slug: "regiao-a",
        name: "Região A",
        countryId: "xx",
        level: "region",
      },
      {
        ...base,
        id: "regiao-b",
        slug: "regiao-b",
        name: "Região B",
        countryId: "xx",
        level: "subregion",
        parentId: "regiao-a",
      },
    ],
    grapes: [
      {
        ...base,
        id: "uva-exemplo",
        slug: "uva-exemplo",
        name: "Uva Exemplo",
        imageIds: [exampleImage.id],
        mainRegionIds: { value: ["regiao-a"], ...src },
      },
    ],
    producers: [
      {
        ...base,
        id: "produtor-exemplo",
        slug: "produtor-exemplo",
        name: "Produtor Exemplo",
        countryId: "xx",
      },
    ],
    wines: [
      {
        ...base,
        id: "vinho-exemplo",
        slug: "vinho-exemplo",
        name: "Vinho Exemplo",
        producerId: "produtor-exemplo",
        countryId: "xx",
        type: { value: "tinto", ...src },
        grapes: { value: [{ grapeId: "uva-exemplo" }], ...src },
        sensory: { body: { level: 3, sourceTerm: "médio", ...src } },
      },
    ],
    vintages: [{ id: "vinho-exemplo-2020", wineId: "vinho-exemplo", year: 2020 }],
  };
}

const errorsOf = (catalog: Catalog, isDemoSet = false) =>
  validateCatalog(catalog, { isDemoSet, today })
    .filter((issue) => issue.level === "error")
    .map((issue) => `${issue.where}: ${issue.message}`);

describe("validateCatalog", () => {
  it("aceita um catálogo coerente", () => {
    expect(errorsOf(validCatalog())).toEqual([]);
  });

  it("regra 13: foto pequena demais (baixa qualidade)", () => {
    const catalog = validCatalog();
    catalog.images[0] = { ...catalog.images[0]!, width: 600, height: 450 };
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("foto pequena demais (600×450)")]);
  });

  it("regra 13: garrafa precisa de altura, não de largura", () => {
    const catalog = validCatalog();
    const bottle = {
      ...catalog.images[0]!,
      width: 300,
      height: 1200,
      subjectType: "wine" as const,
    };
    catalog.images[0] = bottle;
    expect(errorsOf(catalog).filter((message) => message.includes("pequena"))).toEqual([]);
    catalog.images[0] = { ...bottle, height: 600 };
    expect(errorsOf(catalog)).toEqual(
      expect.arrayContaining([expect.stringContaining("foto pequena demais (300×600)")]),
    );
  });

  it("regra 1: fonte citada que não existe", () => {
    const catalog = validCatalog();
    catalog.grapes[0]!.color = { value: "tinta", sourceIds: ["src-inexistente"] };
    expect(errorsOf(catalog)).toEqual([
      expect.stringContaining("fonte inexistente: src-inexistente"),
    ]);
  });

  it("regra 1: fonte citada dentro de texto editorial", () => {
    const catalog = validCatalog();
    catalog.grapes[0]!.summary = {
      text: "Texto próprio de teste, longo o suficiente.",
      basedOnSourceIds: ["src-fantasma"],
      writtenAt: "2026-09-28",
    };
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("src-fantasma")]);
  });

  it("regra 2: imagem que não existe", () => {
    const catalog = validCatalog();
    catalog.grapes[0]!.imageIds = ["img-inexistente"];
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("imagem inexistente")]);
  });

  it("regra 2: foto de outra entidade (ex.: foto de uma uva usada num vinho)", () => {
    const catalog = validCatalog();
    catalog.wines[0]!.imageIds = [exampleImage.id];
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("não desta entidade")]);
  });

  it("regra 4: chave estrangeira quebrada", () => {
    const catalog = validCatalog();
    catalog.wines[0]!.producerId = "produtor-fantasma";
    catalog.vintages[0]!.wineId = "vinho-fantasma";
    catalog.vintages[0]!.id = "vinho-fantasma-2020";
    const errors = errorsOf(catalog);
    expect(errors).toContainEqual(
      expect.stringContaining("producerId aponta para producers inexistente"),
    );
    expect(errors).toContainEqual(expect.stringContaining("wineId aponta para wines inexistente"));
  });

  it("regra 5: slug repetido", () => {
    const catalog = validCatalog();
    catalog.regions[1]!.slug = "regiao-a";
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("slug repetido: regiao-a")]);
  });

  it("regra 6: região-mãe de outro país e ciclo na hierarquia", () => {
    const catalog = validCatalog();
    catalog.countries.push({ ...base, id: "yy", slug: "outro-pais", name: "Outro País" });
    catalog.regions[1]!.countryId = "yy";
    expect(errorsOf(catalog)).toContainEqual(expect.stringContaining("é de outro país"));

    const cyclic = validCatalog();
    cyclic.regions[0]!.parentId = "regiao-b";
    expect(errorsOf(cyclic)).toContainEqual(expect.stringContaining("ciclo"));
  });

  it("regras 8 a 12: erro de formato detectado pelos schemas", () => {
    const catalog = validCatalog();
    catalog.vintages[0]!.alcoholPercent = { value: 40, ...src };
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("alcoholPercent")]);
  });

  it("regra 10: dado de demonstração no catálogo real", () => {
    const catalog = validCatalog();
    catalog.wines[0]!.isDemo = true;
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("fora de src/data/demo")]);
  });

  it("regra 10: item sem isDemo no catálogo de demonstração", () => {
    const errors = errorsOf(validCatalog(), true);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.every((error) => error.includes("sem isDemo"))).toBe(true);
  });

  it("regra 12: termo sensorial fora da tabela ou nível diferente do da tabela", () => {
    const catalog = validCatalog();
    catalog.wines[0]!.sensory = { body: { level: 3, sourceTerm: "robusto", ...src } };
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("fora da tabela")]);

    catalog.wines[0]!.sensory = { body: { level: 5, sourceTerm: "médio", ...src } };
    expect(errorsOf(catalog)).toEqual([expect.stringContaining("corresponde ao nível 3")]);
  });

  it("avisa (sem bloquear) quando a fonte foi consultada há mais de 12 meses", () => {
    const catalog = validCatalog();
    catalog.sources[0]!.accessedAt = "2025-01-10";
    const issues = validateCatalog(catalog, { isDemoSet: false, today });
    expect(issues).toEqual([expect.objectContaining({ level: "warning" })]);
  });
});
