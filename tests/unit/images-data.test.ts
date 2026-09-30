import { describe, expect, it } from "vitest";

import { images } from "@/data/images";
import { producers } from "@/data/producers";
import { regions } from "@/data/regions";

// Fotos de regiões e produtores (F4-08): Wikimedia Commons, licença livre, foto da entidade certa

const commons = images.filter((image) => image.subjectType !== "grape");

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

  it("as 10 regiões têm foto; La Rioja Alta não (nenhuma no Commons)", () => {
    expect(regions.filter((region) => region.imageIds?.length)).toHaveLength(10);
    expect(producers.filter((producer) => producer.imageIds?.length)).toHaveLength(6);
    expect(producers.find((producer) => producer.id === "la-rioja-alta")?.imageIds).toBeUndefined();
  });
});
