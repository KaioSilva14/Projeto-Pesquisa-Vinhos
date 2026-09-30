import { describe, expect, it } from "vitest";

import { producers } from "@/data/producers";
import { sources } from "@/data/sources";
import { vintages } from "@/data/vintages";
import { wines } from "@/data/wines";

// Protege os dados reais de produtores, vinhos e safras (F2-08) contra mudanças acidentais.

describe("produtores reais", () => {
  it("são exatamente os 7 aprovados no CURATION.md (ADR-023)", () => {
    expect(producers.map((producer) => producer.id).sort()).toEqual(
      [
        "catena-zapata",
        "chateau-montelena",
        "chateau-palmer",
        "gd-vajra",
        "la-rioja-alta",
        "louis-roederer",
        "miolo",
      ].sort(),
    );
  });

  it("não registram certificações (as fichas não citam a certificadora)", () => {
    expect(producers.filter((producer) => producer.certifications)).toEqual([]);
  });
});

describe("vinhos reais", () => {
  it("são 13 e todos pertencem a um produtor aprovado", () => {
    const producerIds = new Set(producers.map((producer) => producer.id));
    expect(wines).toHaveLength(13);
    for (const wine of wines) expect(producerIds.has(wine.producerId), wine.id).toBe(true);
  });

  it("citam só fontes do próprio produtor (fichas técnicas e páginas oficiais)", () => {
    const kindOf = new Map(sources.map((source) => [source.id, source.kind]));
    for (const wine of wines) {
      for (const id of wine.sourceIds) expect(kindOf.get(id), `${wine.id}: ${id}`).toBe("producer");
    }
  });

  it("não têm perfil sensorial (as fichas descrevem em prosa, sem termos de escala; ADR-025)", () => {
    expect(wines.filter((wine) => wine.sensory)).toEqual([]);
  });

  it("só o Brut Nature tem categoria de doçura, tirada da própria ficha", () => {
    const withCategory = wines.filter((wine) => wine.sparklingSweetness);
    expect(withCategory.map((wine) => wine.id)).toEqual(["roederer-brut-nature"]);
    expect(withCategory[0]?.sparklingSweetness).toEqual({
      value: "brut-nature",
      sourceIds: ["src-roederer-brut-nature-2015"],
    });
  });

  it("Miolo só tem o Lote 43, o único com ficha ligada a uma safra", () => {
    expect(wines.filter((wine) => wine.producerId === "miolo").map((wine) => wine.id)).toEqual([
      "miolo-lote-43",
    ]);
  });

  it("o Collection 245 é multissafra e não tem safra registrada", () => {
    expect(wines.find((wine) => wine.id === "roederer-collection-245")?.isNonVintage?.value).toBe(
      true,
    );
    expect(vintages.filter((vintage) => vintage.wineId === "roederer-collection-245")).toEqual([]);
  });
});

describe("safras reais", () => {
  const byId = (id: string) => vintages.find((vintage) => vintage.id === id);

  it("toda safra aponta para um vinho existente e tem o link da ficha", () => {
    const wineIds = new Set(wines.map((wine) => wine.id));
    for (const vintage of vintages) {
      expect(wineIds.has(vintage.wineId), vintage.id).toBe(true);
      expect(vintage.technicalSheetUrl?.value, vintage.id).toMatch(/^https:\/\//);
    }
  });

  it("teores alcoólicos são exatamente os das fichas", () => {
    expect(byId("montelena-napa-valley-cabernet-sauvignon-2018")?.alcoholPercent?.value).toBe(14.2);
    expect(byId("montelena-napa-valley-chardonnay-2021")?.alcoholPercent?.value).toBe(13.7);
    expect(byId("catena-zapata-malbec-argentino-2021")?.alcoholPercent?.value).toBe(13.9);
    expect(byId("catena-malbec-2022")?.alcoholPercent?.value).toBe(13.7);
  });

  it("safras cuja ficha não informa o teor ficam sem teor (nada estimado)", () => {
    for (const id of [
      "vajra-barolo-albe-2021",
      "vajra-barolo-bricco-delle-viole-2022",
      "chateau-palmer-2022",
      "palmer-alter-ego-2022",
      "roederer-brut-nature-2015",
      "la-rioja-alta-gran-reserva-904-2016",
      "lagar-de-cervera-2025",
      "miolo-lote-43-2012",
    ]) {
      expect(byId(id)?.alcoholPercent, id).toBeUndefined();
    }
  });

  it("composições incompletas explicam a uva que falta", () => {
    for (const vintage of vintages) {
      const grapes = vintage.grapes;
      if (!grapes) continue;
      const total = grapes.value.reduce((sum, grape) => sum + (grape.percentage ?? 0), 0);
      const allHavePercentage = grapes.value.every((grape) => grape.percentage !== undefined);
      if (allHavePercentage && total < 99)
        expect(grapes.notes, vintage.id).toMatch(/fora do catálogo/);
    }
  });
});
