import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { pairings } from "@/data/pairings";
import { wines } from "@/data/wines";
import { createCatalogService } from "@/services/catalog-service";

// Harmonizações (F4-06) a partir do catálogo real

const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("dados de harmonização", () => {
  it("só os 3 vinhos cujas fontes sugerem pratos têm harmonização", () => {
    expect(
      wines
        .filter((wine) => wine.pairingIds)
        .map((wine) => wine.id)
        .sort(),
    ).toEqual(["la-rioja-alta-gran-reserva-904", "lagar-de-cervera", "miolo-lote-43"].sort());
  });

  it("a sugestão cita a fonte do próprio vinho", () => {
    for (const wine of wines.filter((item) => item.pairingIds)) {
      for (const id of wine.pairingIds!.sourceIds) {
        expect(wine.sourceIds.concat(["src-miolo-lote-43-ficha"]), wine.id).toContain(id);
      }
    }
  });

  it("todo prato cadastrado é sugerido para algum vinho", () => {
    const used = new Set(wines.flatMap((wine) => wine.pairingIds?.value ?? []));
    for (const pairing of pairings) expect(used.has(pairing.id), pairing.id).toBe(true);
  });
});

describe("página de harmonizações", () => {
  it("agrupa por categoria, na ordem de uma refeição, sem grupos vazios", async () => {
    const { groups } = await service().getPairingsPage();
    expect(groups.map((group) => group.category)).toEqual([
      "entradas",
      "carnes",
      "aves",
      "peixes-e-frutos-do-mar",
      "queijos",
      "culinarias",
      "sobremesas",
    ]);
    for (const group of groups) expect(group.pairings.length, group.category).toBeGreaterThan(0);
  });

  it("cada prato lista os vinhos com link e a fonte da sugestão", async () => {
    const { groups, sources } = await service().getPairingsPage();
    const chocolate = groups
      .flatMap((group) => group.pairings)
      .find((item) => item.slug === "sobremesas-com-chocolate");
    expect(chocolate?.wines).toEqual([
      {
        name: "Gran Reserva 904 (La Rioja Alta, S.A.)",
        href: "/vinhos/la-rioja-alta-gran-reserva-904",
        sourceIds: ["src-riojalta-904"],
      },
    ]);
    expect(sources.map((source) => source.id)).toContain("src-riojalta-904");
  });

  it("a página do vinho traz os pratos com link para a página de harmonizações", async () => {
    const data = await service().getWinePage("miolo-lote-43");
    expect(data?.pairings.map((item) => item.href)).toEqual([
      "/harmonizacoes#culinarias-francesa-e-italiana",
      "/harmonizacoes#carnes-de-caca-assadas",
      "/harmonizacoes#churrasco",
    ]);
  });
});
