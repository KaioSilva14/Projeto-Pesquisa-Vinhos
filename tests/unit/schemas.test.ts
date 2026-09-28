import { describe, expect, it } from "vitest";

import { countrySchema, regionSchema } from "@/schemas/geography";
import { grapeSchema } from "@/schemas/grape";
import { pairingSchema } from "@/schemas/pairing";
import { producerSchema } from "@/schemas/producer";
import { sourceSchema } from "@/schemas/source";
import { vintageSchema } from "@/schemas/vintage";
import { wineGrapesSchema, wineSchema } from "@/schemas/wine";

import {
  base,
  exampleGrape,
  exampleSource,
  exampleVintage,
  exampleWine,
} from "../fixtures/entities";

const ok = (result: { success: boolean }) => expect(result.success).toBe(true);
const fails = (result: { success: boolean }) => expect(result.success).toBe(false);
const src = { sourceIds: ["src-teste-01"] };

describe("regras gerais", () => {
  it("aceita as entidades de teste completas", () => {
    ok(sourceSchema.safeParse(exampleSource));
    ok(grapeSchema.safeParse(exampleGrape));
    ok(wineSchema.safeParse(exampleWine));
    ok(vintageSchema.safeParse(exampleVintage));
  });

  it("recusa campo com nome errado em vez de ignorá-lo", () => {
    fails(vintageSchema.safeParse({ ...exampleVintage, alchoolPercent: { value: 13, ...src } }));
    fails(grapeSchema.safeParse({ ...exampleGrape, cor: "tinta" }));
  });

  it("recusa fato sem fonte", () => {
    fails(grapeSchema.safeParse({ ...exampleGrape, color: { value: "tinta", sourceIds: [] } }));
    fails(grapeSchema.safeParse({ ...exampleGrape, color: { value: "tinta" } }));
  });

  it("recusa ids fora do padrão (maiúsculas, acentos, espaços)", () => {
    fails(grapeSchema.safeParse({ ...exampleGrape, id: "Uva Exemplo" }));
    fails(grapeSchema.safeParse({ ...exampleGrape, slug: "uvá-exemplo" }));
  });

  it("isDemo só aceita true (nunca false ou texto)", () => {
    ok(wineSchema.safeParse({ ...exampleWine, isDemo: true }));
    fails(wineSchema.safeParse({ ...exampleWine, isDemo: false }));
  });

  it("texto editorial precisa de fonte", () => {
    const summary = {
      text: "Texto próprio de teste com tamanho suficiente.",
      writtenAt: "2026-09-28",
    };
    fails(grapeSchema.safeParse({ ...exampleGrape, summary }));
    ok(
      grapeSchema.safeParse({
        ...exampleGrape,
        summary: { ...summary, basedOnSourceIds: ["src-teste-01"] },
      }),
    );
  });
});

describe("sourceSchema", () => {
  it("exige prefixo src- e link https", () => {
    fails(sourceSchema.safeParse({ ...exampleSource, id: "teste-01" }));
    fails(sourceSchema.safeParse({ ...exampleSource, url: "http://example.org" }));
    ok(sourceSchema.safeParse({ ...exampleSource, url: "https://example.org" }));
  });
});

describe("country e region", () => {
  it("país usa código ISO de 2 letras", () => {
    const country = { ...base, id: "xx", slug: "pais-exemplo", name: "País Exemplo" };
    ok(countrySchema.safeParse(country));
    fails(countrySchema.safeParse({ ...country, id: "xxx" }));
  });

  it("região exige nível válido e coordenadas dentro do globo", () => {
    const region = {
      ...base,
      id: "regiao-exemplo",
      slug: "regiao-exemplo",
      name: "Região Exemplo",
      countryId: "xx",
      level: "region",
    };
    ok(regionSchema.safeParse(region));
    fails(regionSchema.safeParse({ ...region, level: "zona" }));
    fails(
      regionSchema.safeParse({ ...region, coordinates: { value: { lat: 95, lng: 0 }, ...src } }),
    );
  });
});

describe("composição de uvas", () => {
  it("aceita composição sem percentuais", () => {
    ok(wineGrapesSchema.safeParse([{ grapeId: "uva-a" }, { grapeId: "uva-b" }]));
  });

  it("aceita percentuais que somam ~100", () => {
    ok(
      wineGrapesSchema.safeParse([
        { grapeId: "uva-a", percentage: 90 },
        { grapeId: "uva-b", percentage: 10 },
      ]),
    );
    ok(
      wineGrapesSchema.safeParse([
        { grapeId: "uva-a", percentage: 33.3 },
        { grapeId: "uva-b", percentage: 33.3 },
        { grapeId: "uva-c", percentage: 33.3 },
      ]),
    );
  });

  it("recusa soma acima de 100%", () => {
    fails(
      wineGrapesSchema.safeParse([
        { grapeId: "uva-a", percentage: 80 },
        { grapeId: "uva-b", percentage: 30 },
      ]),
    );
  });

  it("recusa soma baixa quando todas informam percentual", () => {
    fails(
      wineGrapesSchema.safeParse([
        { grapeId: "uva-a", percentage: 60 },
        { grapeId: "uva-b", percentage: 20 },
      ]),
    );
  });

  it("aceita soma parcial quando alguma uva não tem percentual", () => {
    ok(wineGrapesSchema.safeParse([{ grapeId: "uva-a", percentage: 85 }, { grapeId: "uva-b" }]));
  });

  it("recusa a mesma uva duas vezes", () => {
    fails(wineGrapesSchema.safeParse([{ grapeId: "uva-a" }, { grapeId: "uva-a" }]));
  });
});

describe("vintageSchema", () => {
  it("id precisa seguir {wineId}-{ano}", () => {
    fails(vintageSchema.safeParse({ ...exampleVintage, id: "vinho-exemplo-01-2019" }));
  });

  it("recusa safra no futuro ou antes de 1800", () => {
    const nextYear = new Date().getFullYear() + 1;
    fails(
      vintageSchema.safeParse({
        ...exampleVintage,
        year: nextYear,
        id: `vinho-exemplo-01-${nextYear}`,
      }),
    );
    fails(vintageSchema.safeParse({ ...exampleVintage, year: 1799, id: "vinho-exemplo-01-1799" }));
  });

  it("teor alcoólico entre 0 e 25%", () => {
    ok(vintageSchema.safeParse({ ...exampleVintage, alcoholPercent: { value: 13.5, ...src } }));
    fails(vintageSchema.safeParse({ ...exampleVintage, alcoholPercent: { value: 0, ...src } }));
    fails(vintageSchema.safeParse({ ...exampleVintage, alcoholPercent: { value: 26, ...src } }));
  });
});

describe("wineSchema", () => {
  it("tipo de vinho é obrigatório e com fonte", () => {
    const { type, ...withoutType } = exampleWine;
    fails(wineSchema.safeParse(withoutType));
    fails(wineSchema.safeParse({ ...exampleWine, type: { value: "natural", ...src } }));
  });

  it("temperatura de serviço: mínima não passa da máxima", () => {
    ok(
      wineSchema.safeParse({
        ...exampleWine,
        servingTemperature: { value: { minC: 16, maxC: 18 }, ...src },
      }),
    );
    fails(
      wineSchema.safeParse({
        ...exampleWine,
        servingTemperature: { value: { minC: 18, maxC: 16 }, ...src },
      }),
    );
  });

  it("nível sensorial de 1 a 5, sempre com o termo da fonte", () => {
    const body = { level: 3, sourceTerm: "médio", sourceIds: ["src-teste-01"] };
    ok(wineSchema.safeParse({ ...exampleWine, sensory: { body } }));
    fails(wineSchema.safeParse({ ...exampleWine, sensory: { body: { ...body, level: 6 } } }));
    fails(
      wineSchema.safeParse({
        ...exampleWine,
        sensory: { body: { level: 3, sourceIds: ["src-teste-01"] } },
      }),
    );
  });
});

describe("producer e pairing", () => {
  it("produtor: site oficial em https e ano de fundação plausível", () => {
    const producer = {
      ...base,
      id: "produtor-exemplo",
      slug: "produtor-exemplo",
      name: "Produtor Exemplo",
      countryId: "xx",
    };
    ok(
      producerSchema.safeParse({
        ...producer,
        officialWebsite: { value: "https://example.org", ...src },
      }),
    );
    fails(
      producerSchema.safeParse({
        ...producer,
        officialWebsite: { value: "http://example.org", ...src },
      }),
    );
    fails(producerSchema.safeParse({ ...producer, foundedYear: { value: 3000, ...src } }));
  });

  it("harmonização só aceita as categorias definidas", () => {
    const pairing = {
      ...base,
      id: "harmonizacao-exemplo",
      slug: "harmonizacao-exemplo",
      name: "Prato Exemplo",
      category: "queijos",
    };
    ok(pairingSchema.safeParse(pairing));
    fails(pairingSchema.safeParse({ ...pairing, category: "petiscos" }));
  });
});
