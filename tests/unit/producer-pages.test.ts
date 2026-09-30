import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { producerCitationIds } from "@/lib/producers/page-data";
import { producerDescription, producerJsonLd, producerTitle } from "@/lib/seo/producer";
import { createCatalogService } from "@/services/catalog-service";

// Páginas de produtores (F4-04) montadas a partir do catálogo real

const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("lista de produtores", () => {
  it("tem todos os produtores publicados, com regiões, país e contagem de vinhos", async () => {
    const list = await service().getProducerList();
    expect(list).toHaveLength(catalog.producers.length);
    const rioja = list.find((producer) => producer.id === "la-rioja-alta");
    expect(rioja?.context).toBe("Rioja · Rías Baixas · Espanha");
    expect(rioja?.wineCount).toBe(2);
  });
});

describe("página do produtor", () => {
  it("resolve país, regiões, vinhos e fontes na ordem da página", async () => {
    const data = await service().getProducerPage("chateau-montelena");
    expect(data?.country?.slug).toBe("estados-unidos");
    expect(data?.regions.map((region) => region.href)).toEqual(["/regioes/napa-valley"]);
    expect(data?.wines.map((wine) => wine.id).sort()).toEqual([
      "montelena-napa-valley-cabernet-sauvignon",
      "montelena-napa-valley-chardonnay",
    ]);
    expect(data?.sources.map((source) => source.id)).toEqual(producerCitationIds(data!.producer));
  });

  it("toda fonte citada por qualquer produtor existe", async () => {
    for (const slug of await service().listProducerSlugs()) {
      const data = await service().getProducerPage(slug);
      expect(data!.sources, slug).toHaveLength(producerCitationIds(data!.producer).length);
    }
  });

  it("endereço desconhecido → nada", async () => {
    expect(await service().getProducerPage("nao-existe")).toBeUndefined();
  });
});

describe("SEO do produtor", () => {
  it("título e descrição com o que existe", async () => {
    const rioja = await service().getProducerPage("la-rioja-alta");
    expect(producerTitle(rioja!)).toBe("La Rioja Alta, S.A.: produtor em Rioja e Rías Baixas");
    expect(producerDescription(rioja!)).toBe(
      "Produtor de vinhos em Rioja e Rías Baixas, da Espanha: ficha, vinhos do catálogo e fontes oficiais.",
    );
    const miolo = await service().getProducerPage("miolo");
    expect(producerDescription(miolo!)).toMatch(/^Segundo a própria vinícola/);
  });

  it("JSON-LD de Organization com o site oficial e sem avaliação", async () => {
    const data = await service().getProducerPage("chateau-montelena");
    const json = JSON.stringify(producerJsonLd(data!, [], "https://vinum.example"));
    expect(json).toContain('"@type":"Organization"');
    expect(json).toContain('"sameAs":["https://montelena.com"]');
    expect(json).toContain('"foundingDate":"1882"');
    expect(json).not.toMatch(/aggregateRating|review|offers/i);
  });
});
