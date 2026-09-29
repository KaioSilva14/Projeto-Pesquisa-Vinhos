import type { Grape } from "@/schemas/grape";
import type { Producer } from "@/schemas/producer";

import { demo, demoSource, demoText } from "./shared";

// FICTÍCIO. Ver ./shared.ts.

export const demoGrapes: Grape[] = [
  {
    ...demo,
    id: "uva-exemplo-tinta-demo",
    slug: "uva-exemplo-tinta-demonstracao",
    name: "Uva Exemplo Tinta (demonstração)",
    color: { value: "tinta", ...demoSource },
    synonyms: { value: ["Tinta Exemplo"], ...demoSource },
    mainRegionIds: { value: ["regiao-exemplo-norte-demo"], ...demoSource },
    aromaProfile: { value: ["frutas vermelhas", "especiarias"], ...demoSource },
    summary: demoText("Uva inventada com ficha quase completa."),
  },
  {
    ...demo,
    id: "uva-exemplo-branca-demo",
    slug: "uva-exemplo-branca-demonstracao",
    name: "Uva Exemplo Branca (demonstração)",
    color: { value: "branca", ...demoSource },
    mainRegionIds: { value: ["regiao-exemplo-norte-demo"], ...demoSource },
  },
  {
    // Mínima de propósito: testa páginas com poucos dados
    ...demo,
    id: "uva-exemplo-rosada-demo",
    slug: "uva-exemplo-rosada-demonstracao",
    name: "Uva Exemplo Rosada (demonstração)",
  },
];

export const demoProducers: Producer[] = [
  {
    ...demo,
    id: "produtor-exemplo-a-demo",
    slug: "produtor-exemplo-a-demonstracao",
    name: "Produtor Exemplo A (demonstração)",
    countryId: "xx",
    regionIds: ["regiao-exemplo-norte-demo"],
    officialWebsite: { value: "https://example.org", ...demoSource },
    history: demoText("Produtor inventado para testar a página de produtor."),
  },
  {
    ...demo,
    id: "produtor-exemplo-b-demo",
    slug: "produtor-exemplo-b-demonstracao",
    name: "Produtor Exemplo B (demonstração)",
    countryId: "xx",
    regionIds: ["regiao-exemplo-sul-demo"],
  },
];
