import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { createSearcher } from "@/lib/search/search";
import type { Catalog } from "@/schemas/catalog";
import { createCatalogService } from "@/services/catalog-service";

// Índice de busca (F3-02) montado a partir do catálogo real.

const indexOf = (data: Catalog) =>
  createCatalogService(createLocalAdapter([data])).getSearchDocuments();

const HREF_PREFIX = {
  wine: "/vinhos/",
  grape: "/uvas/",
  region: "/regioes/",
  country: "/paises/",
  producer: "/produtores/",
} as const;

describe("índice de busca", () => {
  it("tem um documento por entidade publicada, sem ids repetidos", async () => {
    const documents = await indexOf(catalog);
    const expected =
      catalog.wines.length +
      catalog.grapes.length +
      catalog.regions.length +
      catalog.countries.length +
      catalog.producers.length;
    expect(documents).toHaveLength(expected);
    expect(new Set(documents.map((document) => document.id)).size).toBe(expected);
  });

  it("aponta cada documento para a rota do seu tipo", async () => {
    for (const document of await indexOf(catalog)) {
      expect(document.href, document.id).toMatch(
        new RegExp(`^${HREF_PREFIX[document.kind]}[a-z0-9-]+$`),
      );
    }
  });

  it("fica abaixo de 150 KB (orçamento do PERFORMANCE.md)", async () => {
    const bytes = new TextEncoder().encode(JSON.stringify(await indexOf(catalog))).length;
    expect(bytes).toBeLessThanOrEqual(150 * 1024);
  });

  it("não tem subtítulo vazio", async () => {
    for (const document of await indexOf(catalog)) {
      if ("subtitle" in document) expect(document.subtitle, document.id).not.toBe("");
    }
  });

  it("inclui as uvas das safras nas palavras extras do vinho", async () => {
    const palmer = (await indexOf(catalog)).find(
      (document) => document.id === "wine:chateau-palmer",
    );
    expect(palmer?.keywords).toEqual(
      expect.arrayContaining(["Tinto", "Cabernet Sauvignon", "Merlot"]),
    );
  });

  it("deixa rascunhos de fora", async () => {
    const [first, ...rest] = catalog.grapes;
    const withDraft: Catalog = { ...catalog, grapes: [{ ...first!, status: "draft" }, ...rest] };
    const ids = (await indexOf(withDraft)).map((document) => document.id);
    expect(ids).not.toContain(`grape:${first!.id}`);
  });
});

describe("busca no catálogo real", () => {
  const searcherPromise = indexOf(catalog).then(createSearcher);
  const idsFor = async (query: string) =>
    (await searcherPromise)(query).map((result) => result.document.id);

  it('"sauvinhon" encontra a uva Cabernet Sauvignon em primeiro', async () => {
    expect((await idsFor("sauvinhon"))[0]).toBe("grape:cabernet-sauvignon");
  });

  it('"tinto frances" encontra só os tintos franceses', async () => {
    expect((await idsFor("tinto frances")).sort()).toEqual(
      ["wine:chateau-palmer", "wine:palmer-alter-ego"].sort(),
    );
  });

  it('"vinho argentino" ignora "vinho" e encontra a Argentina e seus vinhos', async () => {
    expect(await idsFor("vinho argentino")).toEqual(
      expect.arrayContaining([
        "country:ar",
        "wine:catena-malbec",
        "wine:catena-zapata-malbec-argentino",
      ]),
    );
  });

  it('"malbek" encontra a uva Malbec em primeiro e nada sem Malbec', async () => {
    const ids = await idsFor("malbek");
    expect(ids[0]).toBe("grape:malbec");
    expect(ids).not.toContain("wine:vajra-barolo-albe");
  });

  it('"tinto" não traz a Argentina só porque "argentino" contém "tino"', async () => {
    expect(await idsFor("tinto")).not.toContain("country:ar");
  });

  it('"napa" não traz a Catena Zapata só porque "zapa" parece "napa"', async () => {
    expect(await idsFor("napa")).not.toContain("producer:catena-zapata");
  });

  it('"rioja" traz a região Rioja antes do produtor La Rioja Alta', async () => {
    const ids = await idsFor("rioja");
    expect(ids.indexOf("region:rioja")).toBeLessThan(ids.indexOf("producer:la-rioja-alta"));
  });
});
