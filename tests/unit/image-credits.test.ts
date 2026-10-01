import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { images } from "@/data/images";
import { createCatalogService } from "@/services/catalog-service";

// Lista de créditos da página /sobre (F5-02)

const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("créditos das imagens", () => {
  it("lista todas as fotos do catálogo, cada uma uma vez", async () => {
    const groups = await service().getImageCredits();
    const ids = groups.flatMap((group) => group.items.map((item) => item.image.id));
    expect(ids.sort()).toEqual(images.map((image) => image.id).sort());
  });

  it("agrupa por tipo e liga cada foto à página da entidade", async () => {
    const groups = await service().getImageCredits();
    expect(groups.map((group) => group.title)).toEqual(["Uvas", "Regiões", "Produtores", "Vinhos"]);
    const malbec = groups[0]?.items.find((item) => item.subjectName === "Malbec");
    expect(malbec?.href).toBe("/uvas/malbec");
  });
});
