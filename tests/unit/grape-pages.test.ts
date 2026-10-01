import { describe, expect, it } from "vitest";

import { createLocalAdapter } from "@/adapters/local";
import { catalog } from "@/data/catalog";
import { grapeCitationIds } from "@/lib/grapes/citations";
import { truncate } from "@/lib/seo/common";
import { grapeDescription, grapeJsonLd } from "@/lib/seo/grape";
import { createCatalogService } from "@/services/catalog-service";

// Páginas de uva (F4-02) montadas a partir do catálogo real

const service = () => createCatalogService(createLocalAdapter([catalog]));

describe("lista de uvas", () => {
  it("tem todas as uvas publicadas, em ordem alfabética, com link", async () => {
    const list = await service().getGrapeList();
    expect(list).toHaveLength(catalog.grapes.length);
    expect(list.map((grape) => grape.name)).toEqual(
      [...list.map((grape) => grape.name)].sort((a, b) => a.localeCompare(b, "pt-BR")),
    );
    for (const grape of list) expect(grape.href, grape.id).toMatch(/^\/uvas\/[a-z0-9-]+$/);
  });

  it("cada uva mostra a foto dela mesma", async () => {
    const list = await service().getGrapeList();
    for (const grape of list) expect(grape.image?.subjectId, grape.id).toBe(grape.id);
  });

  it("conta os vinhos do catálogo com cada uva", async () => {
    const list = await service().getGrapeList();
    expect(list.find((grape) => grape.id === "nebbiolo")?.wineCount).toBe(2);
    expect(list.find((grape) => grape.id === "sangiovese")?.wineCount).toBe(0);
  });
});

describe("página da uva", () => {
  it("resolve regiões principais, vinhos e fontes na ordem da página", async () => {
    const data = await service().getGrapePage("malbec");
    expect(data?.regions.map((region) => region.slug)).toEqual(["mendoza"]);
    expect(data?.wines.map((wine) => wine.id).sort()).toEqual([
      "catena-malbec",
      "catena-zapata-malbec-argentino",
    ]);
    expect(data?.sources.map((source) => source.id)).toEqual(grapeCitationIds(data!.grape));
  });

  it("toda fonte citada por qualquer uva existe", async () => {
    for (const slug of await service().listGrapeSlugs()) {
      const data = await service().getGrapePage(slug);
      expect(data!.sources, slug).toHaveLength(grapeCitationIds(data!.grape).length);
    }
  });

  it("endereço desconhecido → nada", async () => {
    expect(await service().getGrapePage("nao-existe")).toBeUndefined();
  });
});

describe("SEO da uva", () => {
  it("descrição é o resumo próprio, cortado no fim de uma palavra", async () => {
    const data = await service().getGrapePage("sangiovese");
    const description = grapeDescription(data!);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(data!.grape.summary?.text.startsWith(description.replace(/…$/, ""))).toBe(true);
  });

  it("truncate não corta textos curtos", () => {
    expect(truncate("Texto curto.")).toBe("Texto curto.");
    expect(truncate("uma frase longa, com vírgula", 20)).toBe("uma frase longa…");
  });

  it("JSON-LD é um Article do Vinum com trilha", async () => {
    const data = await service().getGrapePage("nebbiolo");
    const json = grapeJsonLd(data!, [{ label: "Uvas", href: "/uvas" }], "https://vinum.example");
    const graph = json["@graph"] as { "@type": string; author?: { name: string } }[];
    expect(graph.map((item) => item["@type"])).toEqual(["Article", "BreadcrumbList"]);
    expect(graph[0]?.author?.name).toBe("Vinum");
  });
});
