import type { Country, Region } from "@/schemas/geography";
import type { Source } from "@/schemas/source";

import { demo, demoSource, demoText } from "./shared";

// FICTÍCIO. Ver ./shared.ts.

export const demoSources: Source[] = [
  {
    id: "src-demo-01",
    kind: "other",
    label: "Fonte de demonstração (não é um documento real)",
    accessedAt: "2026-09-28",
    reliability: "secondary",
    notes: "Usada apenas para testar a interface com dados fictícios.",
  },
];

// "xx" é um código reservado pela ISO para uso livre: não corresponde a nenhum país
export const demoCountries: Country[] = [
  {
    ...demo,
    id: "xx",
    slug: "pais-exemplo-demonstracao",
    name: "País Exemplo (demonstração)",
    summary: demoText("Um país inventado para mostrar como a página de país funciona."),
  },
];

export const demoRegions: Region[] = [
  {
    ...demo,
    id: "regiao-exemplo-norte-demo",
    slug: "regiao-exemplo-norte-demonstracao",
    name: "Região Exemplo Norte (demonstração)",
    countryId: "xx",
    level: "region",
    summary: demoText("Região inventada, com sub-região e uvas principais preenchidas."),
    climate: { value: "Clima fictício de demonstração.", ...demoSource },
    mainGrapeIds: { value: ["uva-exemplo-tinta-demo", "uva-exemplo-branca-demo"], ...demoSource },
  },
  {
    ...demo,
    id: "subregiao-exemplo-demo",
    slug: "subregiao-exemplo-demonstracao",
    name: "Sub-região Exemplo (demonstração)",
    countryId: "xx",
    parentId: "regiao-exemplo-norte-demo",
    level: "subregion",
  },
  {
    ...demo,
    id: "regiao-exemplo-sul-demo",
    slug: "regiao-exemplo-sul-demonstracao",
    name: "Região Exemplo Sul (demonstração)",
    countryId: "xx",
    level: "region",
  },
];
