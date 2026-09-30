import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { applyFilters, FILTER_KEYS } from "@/lib/filters/wine-filters";
import { createCatalogService } from "@/services/catalog-service";

// Lista de vinhos (F3-05) montada a partir do catálogo real

const wineList = () => createCatalogService(createLocalAdapter([catalog])).getWineList();

describe("lista de vinhos", () => {
  it("tem todos os vinhos publicados, com link e tipo", async () => {
    const { items } = await wineList();
    expect(items).toHaveLength(catalog.wines.length);
    for (const item of items) {
      expect(item.href, item.id).toMatch(/^\/vinhos\/[a-z0-9-]+$/);
      expect(item.typeLabel, item.id).not.toBe("");
    }
  });

  it("toda opção de filtro traz pelo menos um vinho (sem opções vazias)", async () => {
    const { items, options } = await wineList();
    for (const key of FILTER_KEYS) {
      for (const option of options[key]) {
        const found = applyFilters(items, { [key]: [option.value] });
        expect(found.length, `${key}=${option.value}`).toBeGreaterThan(0);
      }
    }
  });

  it("uvas vêm da composição do rótulo e das safras", async () => {
    const { items } = await wineList();
    const palmer = items.find((item) => item.id === "chateau-palmer");
    expect(palmer?.facets.uva).toEqual(expect.arrayContaining(["cabernet-sauvignon", "merlot"]));
  });

  it("safra mais recente e multissafra vêm dos dados", async () => {
    const { items } = await wineList();
    expect(items.find((item) => item.id === "chateau-palmer")?.latestYear).toBe(2022);
    const collection = items.find((item) => item.id === "roederer-collection-245");
    expect(collection?.isNonVintage).toBe(true);
    expect(collection?.latestYear).toBeUndefined();
  });

  it('"tintos italianos com Nebbiolo" encontra os dois Barolos da Vajra', async () => {
    const { items } = await wineList();
    const found = applyFilters(items, { tipo: ["tinto"], pais: ["italia"], uva: ["nebbiolo"] });
    expect(found.map((item) => item.id).sort()).toEqual([
      "vajra-barolo-albe",
      "vajra-barolo-bricco-delle-viole",
    ]);
  });
});
