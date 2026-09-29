import type { Pairing } from "@/schemas/pairing";
import type { Vintage } from "@/schemas/vintage";
import type { Wine, WineStyle } from "@/schemas/wine";

import { demo, demoSource, demoText } from "./shared";

// FICTÍCIO. Ver ./shared.ts. Números (teor, percentuais) inventados só para testar a interface.

const tinta = "uva-exemplo-tinta-demo";
const branca = "uva-exemplo-branca-demo";

export const demoStyles: WineStyle[] = [
  {
    ...demo,
    id: "estilo-tinto-demo",
    slug: "estilo-tinto-demonstracao",
    name: "Estilo Tinto (demonstração)",
    type: "tinto",
  },
  {
    ...demo,
    id: "estilo-espumante-demo",
    slug: "estilo-espumante-demonstracao",
    name: "Estilo Espumante (demonstração)",
    type: "espumante",
  },
];

export const demoPairings: Pairing[] = [
  {
    ...demo,
    id: "harmonizacao-queijos-demo",
    slug: "harmonizacao-queijos-demonstracao",
    name: "Queijos (demonstração)",
    category: "queijos",
    guidance: demoText("Orientação inventada, apenas para testar a página."),
  },
];

const wine = (id: string, name: string) => ({
  ...demo,
  id,
  slug: id.replace(/-demo$/, "-demonstracao"),
  name: `${name} (demonstração)`,
  countryId: "xx",
});

export const demoWines: Wine[] = [
  {
    // Ficha completa: testa todos os blocos da página do vinho
    ...wine("vinho-exemplo-01-demo", "Vinho Exemplo 01"),
    producerId: "produtor-exemplo-a-demo",
    regionId: "subregiao-exemplo-demo",
    styleId: "estilo-tinto-demo",
    type: { value: "tinto", ...demoSource },
    grapes: {
      value: [
        { grapeId: tinta, percentage: 85, isMain: true },
        { grapeId: branca, percentage: 15 },
      ],
      ...demoSource,
    },
    productionMethod: { value: "Método fictício de demonstração.", ...demoSource },
    summary: demoText("Vinho inventado com todos os campos preenchidos."),
    sensory: {
      body: { level: 4, sourceTerm: "médio a encorpado", ...demoSource },
      acidity: { level: 3, sourceTerm: "média", ...demoSource },
      tannins: { level: 4, sourceTerm: "firmes", ...demoSource },
      sweetness: { level: 1, sourceTerm: "seco", ...demoSource },
    },
    aromaNotes: { value: ["frutas vermelhas", "baunilha"], ...demoSource },
    servingTemperature: { value: { minC: 16, maxC: 18 }, ...demoSource },
    pairingIds: { value: ["harmonizacao-queijos-demo"], ...demoSource },
    volumeMl: { value: [750], ...demoSource },
  },
  {
    // Só o essencial: testa "dados incompletos" e "imagem indisponível"
    ...wine("vinho-exemplo-02-demo", "Vinho Exemplo 02"),
    producerId: "produtor-exemplo-a-demo",
    type: { value: "branco", ...demoSource },
  },
  {
    ...wine("vinho-exemplo-03-demo", "Vinho Exemplo 03"),
    producerId: "produtor-exemplo-b-demo",
    regionId: "regiao-exemplo-sul-demo",
    styleId: "estilo-espumante-demo",
    type: { value: "espumante", ...demoSource },
    isNonVintage: { value: true, ...demoSource },
    grapes: { value: [{ grapeId: branca }, { grapeId: tinta }], ...demoSource },
    sensory: { sweetness: { level: 1, sourceTerm: "seco", ...demoSource } },
  },
  {
    ...wine("vinho-exemplo-04-demo", "Vinho Exemplo 04"),
    producerId: "produtor-exemplo-b-demo",
    regionId: "regiao-exemplo-sul-demo",
    type: { value: "rose", ...demoSource },
    grapes: { value: [{ grapeId: "uva-exemplo-rosada-demo" }], ...demoSource },
  },
  {
    ...wine("vinho-exemplo-05-demo", "Vinho Exemplo 05"),
    producerId: "produtor-exemplo-a-demo",
    regionId: "regiao-exemplo-norte-demo",
    type: { value: "sobremesa", ...demoSource },
    sensory: { sweetness: { level: 5, sourceTerm: "muito doce", ...demoSource } },
  },
];

export const demoVintages: Vintage[] = [
  {
    id: "vinho-exemplo-01-demo-2019",
    wineId: "vinho-exemplo-01-demo",
    year: 2019,
    isDemo: true,
    alcoholPercent: { value: 13.5, ...demoSource },
    aging: { value: "Estágio fictício de demonstração.", ...demoSource },
  },
  {
    id: "vinho-exemplo-01-demo-2020",
    wineId: "vinho-exemplo-01-demo",
    year: 2020,
    isDemo: true,
    alcoholPercent: { value: 14, ...demoSource },
    grapes: {
      value: [
        { grapeId: tinta, percentage: 90 },
        { grapeId: branca, percentage: 10 },
      ],
      ...demoSource,
    },
  },
  { id: "vinho-exemplo-02-demo-2021", wineId: "vinho-exemplo-02-demo", year: 2021, isDemo: true },
];
