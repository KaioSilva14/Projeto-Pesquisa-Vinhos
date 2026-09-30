import type { Vintage } from "@/schemas/vintage";
import type { WineGrape } from "@/schemas/wine";

import { sources } from "./sources";

// Safras com ficha técnica ou página oficial da própria safra (src/data/sources.ts), lidas em
// 2026-09-30. Campo ausente = a fonte não informa (ex.: teor alcoólico nas fichas da Vajra e do
// Palmer). Uvas fora do catálogo não entram na composição; a nota diz quais são e quanto somam.

type VintageData = {
  wineId: string;
  year: number;
  sourceId: string;
  alcoholPercent?: number;
  totalAcidityGL?: number;
  ph?: number;
  grapes?: [WineGrape, ...WineGrape[]];
  grapesNotes?: string;
  aging?: string;
  extraSourceIds?: string[];
};

function vintage(data: VintageData): Vintage {
  const sourceIds = [data.sourceId, ...(data.extraSourceIds ?? [])] as [string, ...string[]];
  const cite = { sourceIds };
  return {
    id: `${data.wineId}-${data.year}`,
    wineId: data.wineId,
    year: data.year,
    ...(data.alcoholPercent !== undefined && {
      alcoholPercent: { value: data.alcoholPercent, ...cite },
    }),
    ...(data.totalAcidityGL !== undefined && {
      totalAcidityGL: { value: data.totalAcidityGL, ...cite },
    }),
    ...(data.ph !== undefined && { ph: { value: data.ph, ...cite } }),
    ...(data.grapes && {
      grapes: { value: data.grapes, ...cite, ...(data.grapesNotes && { notes: data.grapesNotes }) },
    }),
    ...(data.aging && { aging: { value: data.aging, ...cite } }),
    technicalSheetUrl: { value: urlOf(data.sourceId), ...cite },
  };
}

// Link da ficha = URL da fonte principal (mantido em um lugar só: src/data/sources.ts)
function urlOf(sourceId: string): string {
  const url = sources.find((source) => source.id === sourceId)?.url;
  if (!url) throw new Error(`Fonte sem URL: ${sourceId}`);
  return url;
}

export const vintages: Vintage[] = [
  vintage({
    wineId: "montelena-napa-valley-cabernet-sauvignon",
    year: 2018,
    sourceId: "src-montelena-cs-2018",
    alcoholPercent: 14.2,
    grapes: [
      { grapeId: "cabernet-sauvignon", percentage: 88, isMain: true },
      { grapeId: "merlot", percentage: 11 },
    ],
    grapesNotes: "O 1% restante é Cabernet Franc (uva ainda fora do catálogo).",
    aging: "16 meses em carvalho francês e do Leste Europeu, 26% novo.",
  }),
  vintage({
    wineId: "montelena-napa-valley-chardonnay",
    year: 2021,
    sourceId: "src-montelena-ch-2021",
    alcoholPercent: 13.7,
    grapes: [{ grapeId: "chardonnay", percentage: 100 }],
    aging: "10 meses em carvalho francês.",
  }),
  vintage({
    wineId: "vajra-barolo-albe",
    year: 2021,
    sourceId: "src-vajra-albe-2021",
    grapes: [{ grapeId: "nebbiolo", percentage: 100 }],
    aging: "24 meses em grandes tonéis de carvalho da Eslavônia (40, 50 e 75 hectolitros).",
  }),
  vintage({
    wineId: "vajra-barolo-bricco-delle-viole",
    year: 2022,
    sourceId: "src-vajra-bdv-2022",
    grapes: [{ grapeId: "nebbiolo", percentage: 100 }],
    aging: "22 meses em grandes tonéis de carvalho da Eslavônia (25 e 50 hectolitros).",
  }),
  vintage({
    wineId: "chateau-palmer",
    year: 2022,
    sourceId: "src-palmer-2022",
    grapes: [
      { grapeId: "cabernet-sauvignon", percentage: 51, isMain: true },
      { grapeId: "merlot", percentage: 45 },
    ],
    grapesNotes: "Os outros 4% são Petit Verdot (uva ainda fora do catálogo).",
  }),
  vintage({
    wineId: "palmer-alter-ego",
    year: 2022,
    sourceId: "src-palmer-2022",
    grapes: [
      { grapeId: "merlot", percentage: 51, isMain: true },
      { grapeId: "cabernet-sauvignon", percentage: 43 },
    ],
    grapesNotes: "Os outros 6% são Petit Verdot (uva ainda fora do catálogo).",
  }),
  vintage({
    wineId: "roederer-brut-nature",
    year: 2015,
    sourceId: "src-roederer-brut-nature-2015",
    grapes: [
      { grapeId: "chardonnay", percentage: 46, isMain: true },
      { grapeId: "pinot-noir", percentage: 37 },
    ],
    grapesNotes: "Os outros 17% são Meunier (uva ainda fora do catálogo).",
    aging: "23% do vinho em carvalho; sem fermentação malolática; sem dosagem (0 g/l).",
  }),
  vintage({
    wineId: "la-rioja-alta-gran-reserva-904",
    year: 2016,
    sourceId: "src-riojalta-904",
    grapes: [{ grapeId: "tempranillo", percentage: 90, isMain: true }],
    grapesNotes: "Os outros 10% são Graciano (uva ainda fora do catálogo).",
    aging:
      "Quatro anos em barricas de carvalho americano de fabricação própria; engarrafado em maio de 2021.",
  }),
  vintage({
    wineId: "lagar-de-cervera",
    year: 2025,
    sourceId: "src-riojalta-lagar-de-cervera",
    grapes: [{ grapeId: "albarino", percentage: 100 }],
    aging:
      "Sem fermentação malolática; amadurecido em contato com as borras finas, com bâtonnage periódica.",
  }),
  vintage({
    wineId: "catena-zapata-malbec-argentino",
    year: 2021,
    sourceId: "src-catena-argentino-2021",
    alcoholPercent: 13.9,
    totalAcidityGL: 6.15,
    ph: 3.5,
    grapes: [{ grapeId: "malbec", percentage: 100 }],
    aging: 'Barricas de carvalho francês; a ficha informa "15 and 18 months".',
  }),
  vintage({
    wineId: "catena-malbec",
    year: 2022,
    sourceId: "src-catena-malbec-2022",
    alcoholPercent: 13.7,
    totalAcidityGL: 5.7,
    ph: 3.65,
    grapes: [{ grapeId: "malbec", percentage: 100 }],
    aging: "11 a 13 meses em barricas de carvalho francês de primeiro, segundo e terceiro uso.",
  }),
  vintage({
    wineId: "miolo-lote-43",
    year: 2012,
    sourceId: "src-miolo-lote-43-ficha",
    extraSourceIds: ["src-miolo-lote-43-pagina"],
    grapes: [{ grapeId: "merlot" }, { grapeId: "cabernet-sauvignon" }],
    aging: "12 meses em barricas de carvalho francês e americano.",
  }),
];
