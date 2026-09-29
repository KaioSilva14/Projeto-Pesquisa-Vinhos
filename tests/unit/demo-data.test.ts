import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { parseEnv } from "@/config/env";
import { catalog } from "@/data/catalog";
import { demoCatalog } from "@/data/demo/catalog";
import { validateCatalog } from "@/lib/validation/validate-catalog";
import { createCatalogService } from "@/services/catalog-service";

type Named = { id: string; name: string; isDemo?: true | undefined };

const demoEntities: Named[] = [
  ...demoCatalog.countries,
  ...demoCatalog.regions,
  ...demoCatalog.grapes,
  ...demoCatalog.producers,
  ...demoCatalog.styles,
  ...demoCatalog.wines,
  ...demoCatalog.pairings,
];

describe("dados de demonstração (F2-04)", () => {
  it("passam em todas as regras do fiscal", () => {
    const errors = validateCatalog(demoCatalog, { isDemoSet: true }).filter(
      (issue) => issue.level === "error",
    );
    expect(errors).toEqual([]);
  });

  it("todo nome se identifica como demonstração (nunca parece um nome real)", () => {
    for (const entity of demoEntities) {
      expect(entity.name, entity.id).toMatch(/\(demonstração\)$/);
      expect(entity.isDemo, entity.id).toBe(true);
    }
  });

  it("todas as safras de demonstração estão marcadas", () => {
    expect(demoCatalog.vintages.every((vintage) => vintage.isDemo === true)).toBe(true);
  });

  it("citam apenas a fonte de demonstração", () => {
    expect(demoCatalog.sources.map((source) => source.id)).toEqual(["src-demo-01"]);
  });

  it("nenhum id de demonstração existe no catálogo real", () => {
    const realIds = new Set(
      [...catalog.wines, ...catalog.grapes, ...catalog.regions, ...catalog.producers].map(
        (entity) => entity.id,
      ),
    );
    expect(demoEntities.filter((entity) => realIds.has(entity.id))).toEqual([]);
  });

  it("com a opção desligada, os services não entregam nada de demonstração", async () => {
    const service = createCatalogService(createLocalAdapter([catalog]));
    const wines = await service.listWines();
    expect(wines.some((wine) => wine.isDemo)).toBe(false);
  });

  it("com a opção ligada, os vinhos de demonstração aparecem", async () => {
    const service = createCatalogService(createLocalAdapter([catalog, demoCatalog]));
    expect(await service.getWineBySlug("vinho-exemplo-01-demonstracao")).toBeDefined();
  });

  it("não podem ser ligados em produção", () => {
    expect(() =>
      parseEnv({ VERCEL_ENV: "production", NEXT_PUBLIC_ENABLE_DEMO_DATA: "true" }),
    ).toThrow();
  });
});
