import { describe, expect, it } from "vitest";

import { grapes } from "@/data/grapes";
import { images } from "@/data/images";
import { sources } from "@/data/sources";

// Protege os dados reais das uvas (F2-06) contra mudanças acidentais.

/** As 10 uvas aprovadas em docs/CURATION.md (ADR-023), com o número da ficha no VIVC. */
const approved: Record<string, number> = {
  sangiovese: 10680,
  nebbiolo: 8417,
  "cabernet-sauvignon": 1929,
  merlot: 7657,
  chardonnay: 2455,
  "pinot-noir": 9279,
  tempranillo: 12350,
  albarino: 15689,
  malbec: 2889,
  "torrontes-riojano": 15162,
};

/** Todos os sourceIds citados em qualquer lugar do objeto. */
function citedSources(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((entry) => citedSources(entry, found));
  else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if ((key === "sourceIds" || key === "basedOnSourceIds") && Array.isArray(entry)) {
        entry.forEach((id: string) => found.add(id));
      } else citedSources(entry, found);
    }
  }
  return found;
}

describe("dados reais das uvas", () => {
  it("são exatamente as 10 aprovadas no CURATION.md", () => {
    expect(grapes.map((grape) => grape.id).sort()).toEqual(Object.keys(approved).sort());
  });

  it("cada uva usa o número correto do VIVC", () => {
    for (const grape of grapes) {
      expect(grape.vivcId, grape.id).toBe(String(approved[grape.id]));
    }
  });

  it("fatos da uva citam só a própria ficha do VIVC; outras fontes só na ligação com regiões", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    for (const grape of grapes) {
      const expected = `src-vivc-${grape.vivcId}`;
      const { mainRegionIds, ...facts } = grape;
      expect([...citedSources(facts)], grape.id).toEqual([expected]);
      expect(sourceIds.has(expected), grape.id).toBe(true);
      for (const id of mainRegionIds?.sourceIds ?? []) {
        expect(sourceIds.has(id), `${grape.id}: ${id}`).toBe(true);
      }
    }
  });

  it("nenhuma uva real está marcada como demonstração", () => {
    expect(grapes.filter((grape) => grape.isDemo)).toEqual([]);
  });

  it("uvas sem parentesco confirmado pelo VIVC não têm o campo", () => {
    const withoutParentage = ["sangiovese", "nebbiolo", "pinot-noir", "albarino"];
    for (const id of withoutParentage) {
      expect(grapes.find((grape) => grape.id === id)?.parentage, id).toBeUndefined();
    }
  });

  it("Torrontés Riojano não tem origem (a ficha do VIVC não informa)", () => {
    expect(grapes.find((grape) => grape.id === "torrontes-riojano")?.origin).toBeUndefined();
  });
});

describe("fotos das uvas (F2-06b, ADR-024)", () => {
  it("cada foto é da própria uva; as do VIVC vêm da página de fotos da mesma variedade", () => {
    for (const grape of grapes) {
      for (const imageId of grape.imageIds ?? []) {
        const image = images.find((item) => item.id === imageId);
        expect(image?.subjectType, imageId).toBe("grape");
        expect(image?.subjectId, imageId).toBe(grape.id);
        if (image?.sourceUrl.includes("vivc.de")) {
          expect(image.sourceUrl, imageId).toMatch(new RegExp(`id=${grape.vivcId}$`));
        }
      }
    }
  });

  it("toda foto do VIVC cita o JKI e registra a permissão e a modificação", () => {
    for (const image of images.filter((item) => item.sourceUrl.includes("vivc.de"))) {
      expect(image.credit, image.id).toContain("Julius Kühn-Institut (JKI)");
      expect(image.license, image.id).toMatch(/permitida pelo JKI/);
      expect(image.modified, image.id).toBeDefined();
    }
  });

  it("todas as uvas têm foto; a da Torrontés Riojano vem do INV (CC BY 4.0), não do VIVC", () => {
    expect(grapes.filter((grape) => grape.imageIds?.length).length).toBe(grapes.length);
    const torrontes = images.find((image) => image.subjectId === "torrontes-riojano");
    expect(torrontes?.license).toBe("CC BY 4.0");
    expect(torrontes?.credit).toMatch(/Instituto Nacional de Vitivinicultura/);
    expect(torrontes?.alt).toMatch(/relatório de variedade do INV/);
  });
});
