import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { countryCitationIds, regionCitationIds } from "@/lib/places/citations";
import { countryDescription, regionDescription, regionJsonLd } from "@/lib/seo/place";
import { createCatalogService } from "@/services/catalog-service";

// Páginas de regiões e países (F4-03) montadas a partir do catálogo real

const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("lista de regiões", () => {
  it("agrupa todas as regiões por país, em ordem alfabética", async () => {
    const groups = await service().getRegionGroups();
    expect(groups.map((group) => group.country.name)).toEqual([
      "Argentina",
      "Brasil",
      "Espanha",
      "Estados Unidos",
      "França",
      "Itália",
    ]);
    expect(groups.flatMap((group) => group.regions)).toHaveLength(catalog.regions.length);
  });

  it("contexto é a categoria da denominação oficial, ou o nível da região", async () => {
    const regions = (await service().getRegionGroups()).flatMap((group) => group.regions);
    expect(regions.find((region) => region.id === "barolo")?.context).toBe("DOCG");
    expect(regions.find((region) => region.id === "bordeaux")?.context).toBe("Região vinícola");
  });
});

describe("página da região", () => {
  it("resolve país, uvas principais, produtores, vinhos e fontes", async () => {
    const data = await service().getRegionPage("bordeaux");
    expect(data?.country?.slug).toBe("franca");
    expect(data?.grapes.map((grape) => grape.href)).toEqual([
      "/uvas/merlot",
      "/uvas/cabernet-sauvignon",
    ]);
    expect(data?.producers.map((producer) => producer.name)).toEqual(["Château Palmer"]);
    expect(data?.wines).toHaveLength(2);
    expect(data?.sources.map((source) => source.id)).toEqual(regionCitationIds(data!.region));
  });

  it("toda fonte citada por qualquer região existe", async () => {
    for (const slug of await service().listRegionSlugs()) {
      const data = await service().getRegionPage(slug);
      expect(data!.sources, slug).toHaveLength(regionCitationIds(data!.region).length);
    }
  });

  it("região sem uva principal confirmada fica sem uvas (Valle de Cafayate)", async () => {
    const data = await service().getRegionPage("valle-de-cafayate");
    expect(data?.grapes).toEqual([]);
  });

  it("endereço desconhecido → nada", async () => {
    expect(await service().getRegionPage("nao-existe")).toBeUndefined();
  });
});

describe("países", () => {
  it("lista os 6 países com a quantidade de regiões e de vinhos", async () => {
    const list = await service().getCountryList();
    expect(list).toHaveLength(6);
    const italia = list.find((country) => country.id === "it");
    expect(italia?.context).toBe("2 regiões no catálogo");
    expect(italia?.wineCount).toBe(2);
  });

  it("página do país junta regiões, produtores e vinhos", async () => {
    const data = await service().getCountryPage("franca");
    expect(data?.regions.map((region) => region.name)).toEqual(["Bordeaux", "Champagne"]);
    expect(data?.producers.map((producer) => producer.name)).toEqual([
      "Château Palmer",
      "Louis Roederer",
    ]);
    expect(data?.wines).toHaveLength(4);
    // Fontes do texto do país + as dos pontos do mapa (uma por região)
    expect(data?.sources).toHaveLength(
      countryCitationIds(data!.country).length + data!.mapPoints.length,
    );
  });

  it("endereço desconhecido → nada", async () => {
    expect(await service().getCountryPage("atlantida")).toBeUndefined();
  });
});

describe("SEO de regiões e países", () => {
  it("descrições com o que existe, até 160 caracteres", async () => {
    const region = await service().getRegionPage("rioja");
    const country = await service().getCountryPage("italia");
    expect(regionDescription(region!).length).toBeLessThanOrEqual(160);
    expect(countryDescription(country!)).toBe(
      "Regiões (Barolo, Chianti Classico), produtores e vinhos da Itália no catálogo do Vinum, com fontes.",
    );
  });

  it("JSON-LD da região é um Place dentro do país", async () => {
    const data = await service().getRegionPage("napa-valley");
    const json = JSON.stringify(regionJsonLd(data!, [], "https://vinum.example"));
    expect(json).toContain('"@type":"Place"');
    expect(json).toContain('"containedInPlace":{"@type":"Country","name":"Estados Unidos"}');
  });
});
