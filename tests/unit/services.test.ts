import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { emptyCatalog, type Catalog } from "@/schemas/catalog";
import { createCatalogService } from "@/services/catalog-service";

import { base, exampleSource } from "../fixtures/entities";
import { exampleImage } from "../fixtures/images";

const src = { sourceIds: ["src-teste-01"] as [string] };
const draft = { ...base, status: "draft" as const };

/** Catálogo fictício com itens publicados e um rascunho de cada tipo relevante. */
function fixtureCatalog(): Catalog {
  return {
    ...emptyCatalog(),
    sources: [
      exampleSource,
      { ...exampleSource, id: "src-teste-02", label: "Segunda fonte de teste" },
    ],
    images: [exampleImage],
    countries: [
      { ...base, id: "xx", slug: "pais-x", name: "País X" },
      { ...base, id: "yy", slug: "pais-y", name: "Éden" },
    ],
    regions: [
      { ...base, id: "reg-a", slug: "reg-a", name: "Região A", countryId: "xx", level: "region" },
      {
        ...base,
        id: "reg-a1",
        slug: "reg-a1",
        name: "Sub A1",
        countryId: "xx",
        level: "subregion",
        parentId: "reg-a",
      },
      {
        ...base,
        id: "reg-a1x",
        slug: "reg-a1x",
        name: "Denominação A1x",
        countryId: "xx",
        level: "appellation",
        parentId: "reg-a1",
      },
      { ...base, id: "reg-y", slug: "reg-y", name: "Região Y", countryId: "yy", level: "region" },
      {
        ...draft,
        id: "reg-rascunho",
        slug: "reg-rascunho",
        name: "Rascunho",
        countryId: "xx",
        level: "region",
      },
    ],
    grapes: [
      { ...base, id: "uva-b", slug: "uva-b", name: "Uva B" },
      { ...base, id: "uva-a", slug: "uva-a", name: "Uva A" },
      { ...draft, id: "uva-rascunho", slug: "uva-rascunho", name: "Uva Rascunho" },
    ],
    producers: [
      {
        ...base,
        id: "prod-1",
        slug: "prod-1",
        name: "Produtor 1",
        countryId: "xx",
        regionIds: ["reg-a1"],
      },
      { ...base, id: "prod-2", slug: "prod-2", name: "Produtor 2", countryId: "yy" },
    ],
    wines: [
      {
        ...base,
        id: "vinho-1",
        slug: "vinho-1",
        name: "Vinho 1",
        producerId: "prod-1",
        countryId: "xx",
        type: { value: "tinto", ...src },
      },
      {
        ...draft,
        id: "vinho-rascunho",
        slug: "vinho-rascunho",
        name: "Vinho Rascunho",
        producerId: "prod-1",
        countryId: "xx",
        type: { value: "tinto", ...src },
      },
    ],
    vintages: [
      { id: "vinho-1-2018", wineId: "vinho-1", year: 2018 },
      { id: "vinho-1-2020", wineId: "vinho-1", year: 2020 },
      { id: "vinho-rascunho-2020", wineId: "vinho-rascunho", year: 2020 },
    ],
  };
}

const service = () => createCatalogService(createLocalAdapter([fixtureCatalog()]));

describe("regras gerais dos services", () => {
  it("nunca entrega rascunhos", async () => {
    const s = service();
    expect(await s.getGrapeBySlug("uva-rascunho")).toBeUndefined();
    expect((await s.listRegions()).map((r) => r.id)).not.toContain("reg-rascunho");
    expect(await s.getWineBySlug("vinho-rascunho")).toBeUndefined();
  });

  it("não entrega safras de vinho em rascunho", async () => {
    expect(await service().listVintages("vinho-rascunho")).toEqual([]);
  });

  it("ordena listas em ordem alfabética do português", async () => {
    expect((await service().listCountries()).map((c) => c.name)).toEqual(["Éden", "País X"]);
    expect((await service().listGrapes()).map((g) => g.name)).toEqual(["Uva A", "Uva B"]);
  });

  it("slug inexistente devolve undefined (a página mostra 404)", async () => {
    expect(await service().getCountryBySlug("nao-existe")).toBeUndefined();
  });

  it("une vários catálogos (real + demonstração)", async () => {
    const extra = {
      ...emptyCatalog(),
      grapes: [{ ...base, id: "uva-c", slug: "uva-c", name: "Uva C" }],
    };
    const s = createCatalogService(createLocalAdapter([fixtureCatalog(), extra]));
    expect((await s.listGrapes()).map((g) => g.id)).toEqual(["uva-a", "uva-b", "uva-c"]);
  });
});

describe("geografia", () => {
  it("filtra regiões por país e por nível (só as de primeiro nível)", async () => {
    const s = service();
    expect((await s.listRegions({ countryId: "xx", parentId: null })).map((r) => r.id)).toEqual([
      "reg-a",
    ]);
    expect((await s.listRegions({ parentId: "reg-a" })).map((r) => r.id)).toEqual(["reg-a1"]);
  });

  it("monta o caminho da região para a trilha de navegação", async () => {
    const s = service();
    const appellation = await s.getRegionBySlug("reg-a1x");
    expect(appellation).toBeDefined();
    expect((await s.getRegionPath(appellation!)).map((r) => r.id)).toEqual([
      "reg-a",
      "reg-a1",
      "reg-a1x",
    ]);
  });
});

describe("produtores, vinhos e referências", () => {
  it("filtra produtores por região", async () => {
    expect((await service().listProducers({ regionId: "reg-a1" })).map((p) => p.id)).toEqual([
      "prod-1",
    ]);
  });

  it("lista vinhos do produtor, sem rascunhos", async () => {
    expect((await service().listWinesByProducer("prod-1")).map((w) => w.id)).toEqual(["vinho-1"]);
  });

  it("lista safras da mais recente para a mais antiga", async () => {
    expect((await service().listVintages("vinho-1")).map((v) => v.year)).toEqual([2020, 2018]);
  });

  it("fontes na ordem de citação, sem repetir e ignorando inexistentes", async () => {
    const sources = await service().getSourcesByIds([
      "src-teste-02",
      "src-teste-01",
      "src-teste-02",
      "src-fantasma",
    ]);
    expect(sources.map((s) => s.id)).toEqual(["src-teste-02", "src-teste-01"]);
  });

  it("uvas por ids ignora rascunhos", async () => {
    expect((await service().getGrapesByIds(["uva-rascunho", "uva-b"])).map((g) => g.id)).toEqual([
      "uva-b",
    ]);
  });

  it("foto principal é a primeira da lista; sem fotos, undefined", async () => {
    const s = service();
    expect((await s.getMainImage([exampleImage.id]))?.id).toBe(exampleImage.id);
    expect(await s.getMainImage(undefined)).toBeUndefined();
  });
});
