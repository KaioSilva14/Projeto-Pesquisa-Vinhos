import { describe, expect, it } from "vitest";

import { countries } from "@/data/countries";
import { grapes } from "@/data/grapes";
import { regions } from "@/data/regions";

// Protege os dados reais de países e regiões (F2-07) contra mudanças acidentais.

/** As 10 regiões aprovadas em docs/CURATION.md (ADR-023) e o país de cada uma. */
const approved: Record<string, string> = {
  "chianti-classico": "it",
  barolo: "it",
  bordeaux: "fr",
  champagne: "fr",
  rioja: "es",
  "rias-baixas": "es",
  "napa-valley": "us",
  mendoza: "ar",
  "valle-de-cafayate": "ar",
  "vale-dos-vinhedos": "br",
};

describe("países (ADR-019)", () => {
  it("são exatamente os 6 do escopo inicial", () => {
    expect(countries.map((country) => country.id).sort()).toEqual([
      "ar",
      "br",
      "es",
      "fr",
      "it",
      "us",
    ]);
  });
});

describe("regiões reais", () => {
  it("são exatamente as 10 aprovadas, cada uma no país certo", () => {
    expect(Object.fromEntries(regions.map((region) => [region.id, region.countryId]))).toEqual(
      approved,
    );
  });

  it("toda região tem pelo menos uma fonte geral", () => {
    for (const region of regions) expect(region.sourceIds.length, region.id).toBeGreaterThan(0);
  });

  it("uvas principais explicam em que termos a fonte as aponta (notes)", () => {
    for (const region of regions) {
      if (region.mainGrapeIds) expect(region.mainGrapeIds.notes, region.id).toBeTruthy();
    }
  });

  it("Valle de Cafayate não tem uva principal (fonte específica ainda não encontrada)", () => {
    expect(
      regions.find((region) => region.id === "valle-de-cafayate")?.mainGrapeIds,
    ).toBeUndefined();
  });
});

describe("ligação uva ↔ região", () => {
  it("é a mesma nos dois sentidos", () => {
    for (const region of regions) {
      for (const grapeId of region.mainGrapeIds?.value ?? []) {
        const grape = grapes.find((item) => item.id === grapeId);
        expect(grape?.mainRegionIds?.value, `${region.id} → ${grapeId}`).toContain(region.id);
      }
    }
    for (const grape of grapes) {
      for (const regionId of grape.mainRegionIds?.value ?? []) {
        const region = regions.find((item) => item.id === regionId);
        expect(region?.mainGrapeIds?.value, `${grape.id} → ${regionId}`).toContain(grape.id);
      }
    }
  });

  it("Malbec não aparece como principal em Bordeaux (lá ela é só auxiliar)", () => {
    expect(regions.find((region) => region.id === "bordeaux")?.mainGrapeIds?.value).not.toContain(
      "malbec",
    );
  });

  it("Torrontés Riojano ainda não tem região principal", () => {
    expect(grapes.find((grape) => grape.id === "torrontes-riojano")?.mainRegionIds).toBeUndefined();
  });
});
