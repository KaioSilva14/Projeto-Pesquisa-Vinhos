import { describe, expect, it } from "vitest";

import { images } from "@/data/images";
import { producers } from "@/data/producers";
import { regions } from "@/data/regions";
import { wines } from "@/data/wines";

// Fotos de regiões e produtores (F4-08): Wikimedia Commons, licença livre, foto da entidade certa

const commons = images.filter((image) => image.sourceUrl.includes("commons.wikimedia.org"));

describe("fotos de regiões e produtores", () => {
  it("vêm do Wikimedia Commons com licença livre, link da licença e crédito", () => {
    for (const image of commons) {
      expect(image.sourceUrl, image.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(image.license, image.id).toMatch(/^(CC BY(-SA)? \d\.\d|CC0)$/);
      expect(image.licenseUrl, image.id).toMatch(/^https:\/\/creativecommons\.org\//);
      expect(image.credit, image.id).toMatch(/via Wikimedia Commons$/);
      expect(image.modified, image.id).toBeDefined();
    }
  });

  it("cada foto está ligada à própria entidade, e só a ela", () => {
    for (const region of regions) {
      for (const id of region.imageIds ?? []) {
        const image = images.find((item) => item.id === id);
        expect(image?.subjectType, id).toBe("region");
        expect(image?.subjectId, id).toBe(region.id);
      }
    }
    for (const producer of producers) {
      for (const id of producer.imageIds ?? []) {
        const image = images.find((item) => item.id === id);
        expect(image?.subjectType, id).toBe("producer");
        expect(image?.subjectId, id).toBe(producer.id);
      }
    }
  });

  it("todas as regiões e todos os produtores têm foto", () => {
    expect(regions.filter((region) => region.imageIds?.length)).toHaveLength(regions.length);
    expect(producers.filter((producer) => producer.imageIds?.length)).toHaveLength(
      producers.length,
    );
  });

  it("a foto da La Rioja Alta vem do site oficial (não há no Commons; ADR-028)", () => {
    const image = images.find((item) => item.subjectId === "la-rioja-alta");
    expect(image?.subjectType).toBe("producer");
    expect(image?.sourceUrl).toMatch(/^https:\/\/www\.riojalta\.com\//);
    expect(image?.license).toMatch(/ADR-028/);
  });
});

describe("fotos de garrafas (ADR-028)", () => {
  const bottles = images.filter((image) => image.subjectType === "wine");

  it("vêm do site do produtor ou do importador oficial, com crédito e a observação de uso", () => {
    for (const image of bottles) {
      expect(image.credit, image.id).toMatch(/\(site oficial\)$|importador oficial/);
      expect(image.license, image.id).toMatch(/sem autorização expressa.*ADR-028/);
      expect(image.sourceUrl, image.id).toMatch(/^https:\/\//);
    }
  });

  it("cada garrafa está ligada ao próprio vinho", () => {
    for (const wine of wines) {
      for (const id of wine.imageIds ?? []) {
        expect(images.find((item) => item.id === id)?.subjectId, id).toBe(wine.id);
      }
    }
  });

  it("todos os vinhos têm foto da garrafa", () => {
    expect(wines.filter((wine) => wine.imageIds?.length)).toHaveLength(wines.length);
  });

  it("fotos tiradas de fichas técnicas em PDF apontam para o PDF e dizem isso", () => {
    for (const image of bottles.filter((item) => item.sourceUrl.endsWith(".pdf"))) {
      expect(image.modified, image.id).toMatch(/ficha (técnica|completa) em PDF/);
    }
  });
});
