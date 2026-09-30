import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import {
  formatDate,
  formatList,
  formatNumber,
  formatPercent,
  formatTemperatureRange,
  formatVolume,
} from "@/lib/format";
import { wineDescription, wineJsonLd } from "@/lib/seo/wine";
import { numberCitations, wineCitationIds } from "@/lib/wines/citations";
import { relatedWines } from "@/lib/wines/related";
import { createCatalogService } from "@/services/catalog-service";

import { exampleVintage, exampleWine } from "../fixtures/entities";

const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("formatação em português", () => {
  it("números, percentuais, volumes, temperaturas, datas e listas", () => {
    expect(formatNumber(6.15)).toBe("6,15");
    expect(formatPercent(14.2)).toBe("14,2%");
    expect(formatVolume(750)).toBe("750 ml");
    expect(formatVolume(1500)).toBe("1,5 L");
    expect(formatTemperatureRange({ minC: 16, maxC: 18 })).toBe("16 a 18 °C");
    expect(formatTemperatureRange({ minC: 8, maxC: 8 })).toBe("8 °C");
    expect(formatDate("2026-09-30")).toBe("30 de setembro de 2026");
    expect(formatList(["Merlot", "Cabernet Sauvignon"])).toBe("Merlot e Cabernet Sauvignon");
  });
});

describe("numeração das fontes", () => {
  it("segue a ordem da página, sem repetir", () => {
    const wine = {
      ...exampleWine,
      sourceIds: ["src-geral"],
      type: { value: "tinto" as const, sourceIds: ["src-tipo", "src-geral"] },
    };
    const vintage = { ...exampleVintage, ph: { value: 3.5, sourceIds: ["src-safra"] } };
    const ids = wineCitationIds(wine, [vintage]);
    expect(ids.slice(0, 2)).toEqual(["src-geral", "src-tipo"]);
    expect(ids).toContain("src-safra");
    expect(new Set(ids).size).toBe(ids.length);
    expect(numberCitations(["a", "b"])).toEqual({ a: 1, b: 2 });
  });
});

describe("vinhos relacionados", () => {
  it("cada vinho aparece em um grupo só, sem o próprio vinho", async () => {
    const { items } = await service().getWineList();
    const groups = relatedWines("chateau-palmer", items);
    const ids = groups.flatMap((group) => group.items.map((item) => item.id));
    expect(groups[0]).toMatchObject({ key: "produtor" });
    expect(groups[0]?.items.map((item) => item.id)).toEqual(["palmer-alter-ego"]);
    expect(ids).not.toContain("chateau-palmer");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("vinho desconhecido → nenhum relacionado; limite por grupo", async () => {
    const { items } = await service().getWineList();
    expect(relatedWines("nao-existe", items)).toEqual([]);
    for (const group of relatedWines("catena-malbec", items, 1)) {
      expect(group.items).toHaveLength(1);
    }
  });
});

describe("dados da página do vinho", () => {
  it("resolve produtor, região, país, uvas, safras e fontes", async () => {
    const data = await service().getWinePage("chateau-palmer");
    expect(data?.producer?.name).toBe("Château Palmer");
    expect(data?.region?.slug).toBe("bordeaux");
    expect(data?.country?.slug).toBe("franca");
    expect(data?.vintages.map((vintage) => vintage.year)).toEqual([2022]);
    expect(Object.keys(data?.grapes ?? {}).sort()).toEqual(["cabernet-sauvignon", "merlot"]);
    expect(data?.sources.map((source) => source.id)).toEqual(["src-palmer-2022"]);
  });

  it("toda fonte citada por qualquer vinho existe", async () => {
    for (const slug of await service().listWineSlugs()) {
      const data = await service().getWinePage(slug);
      const cited = wineCitationIds(data!.wine, data!.vintages);
      expect(
        data!.sources.map((source) => source.id),
        slug,
      ).toEqual(cited);
    }
  });

  it("endereço desconhecido → nada", async () => {
    expect(await service().getWinePage("nao-existe")).toBeUndefined();
  });
});

describe("SEO do vinho", () => {
  it("descrição só com as partes que existem", async () => {
    const data = await service().getWinePage("chateau-palmer");
    expect(wineDescription(data!)).toBe(
      "Tinto de Bordeaux, França, elaborado com Cabernet Sauvignon e Merlot. Ficha técnica e fontes oficiais.",
    );
  });

  it("JSON-LD de produto sem oferta, preço nem avaliação", async () => {
    const data = await service().getWinePage("roederer-brut-nature");
    const json = JSON.stringify(wineJsonLd(data!, [], "https://vinum.example"));
    expect(json).toContain('"@type":"Product"');
    expect(json).toContain('"name":"Louis Roederer"');
    expect(json).not.toMatch(/offers|price|aggregateRating|review/i);
  });
});
