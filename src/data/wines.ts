import type { WineType } from "@/schemas/common";
import type { Wine } from "@/schemas/wine";

// Vinhos dos produtores aprovados (docs/CURATION.md). Fatos das fichas técnicas e páginas
// oficiais (src/data/sources.ts), lidos em 2026-09-30. Perfil sensorial fica vazio: as fichas
// usam termos em inglês/francês/espanhol que não estão na tabela de src/lib/sensory-map.ts
// (revisão na F2-09). Dados que mudam por safra ficam em ./vintages.ts.

type WineData = Omit<Wine, "status" | "createdAt" | "updatedAt" | "slug" | "type" | "sourceIds"> & {
  type: WineType;
  sourceId: string;
};

function wine({ type, sourceId, ...data }: WineData): Wine {
  return {
    ...data,
    slug: data.id,
    status: "published",
    createdAt: "2026-09-30",
    updatedAt: "2026-09-30",
    sourceIds: [sourceId],
    type: { value: type, sourceIds: [sourceId] },
  };
}

const src = (id: string) => ({ sourceIds: [id] as [string] });

export const wines: Wine[] = [
  wine({
    id: "montelena-napa-valley-cabernet-sauvignon",
    name: "Napa Valley Cabernet Sauvignon",
    producerId: "chateau-montelena",
    countryId: "us",
    regionId: "napa-valley",
    type: "tinto",
    sourceId: "src-montelena-cs-2018",
  }),
  wine({
    id: "montelena-napa-valley-chardonnay",
    name: "Napa Valley Chardonnay",
    producerId: "chateau-montelena",
    countryId: "us",
    regionId: "napa-valley",
    type: "branco",
    sourceId: "src-montelena-ch-2021",
  }),
  wine({
    id: "vajra-barolo-albe",
    name: "Barolo Albe",
    producerId: "gd-vajra",
    countryId: "it",
    regionId: "barolo",
    type: "tinto",
    sourceId: "src-vajra-albe-2021",
    volumeMl: { value: [750, 1500, 3000], ...src("src-vajra-albe-2021") },
  }),
  wine({
    id: "vajra-barolo-bricco-delle-viole",
    name: "Barolo Bricco delle Viole",
    producerId: "gd-vajra",
    countryId: "it",
    regionId: "barolo",
    type: "tinto",
    sourceId: "src-vajra-bdv-2022",
    volumeMl: { value: [750, 1500, 3000], ...src("src-vajra-bdv-2022") },
  }),
  wine({
    id: "chateau-palmer",
    name: "Château Palmer",
    producerId: "chateau-palmer",
    countryId: "fr",
    regionId: "bordeaux",
    type: "tinto",
    sourceId: "src-palmer-2022",
  }),
  wine({
    id: "palmer-alter-ego",
    name: "Alter Ego",
    producerId: "chateau-palmer",
    countryId: "fr",
    regionId: "bordeaux",
    type: "tinto",
    sourceId: "src-palmer-2022",
  }),
  wine({
    id: "roederer-collection-245",
    name: "Collection 245",
    producerId: "louis-roederer",
    countryId: "fr",
    regionId: "champagne",
    type: "espumante",
    sourceId: "src-roederer-collection-245",
    // Multissafra: 55% colheita 2020 + vinhos de reserva de vários anos
    isNonVintage: { value: true, ...src("src-roederer-collection-245") },
    grapes: {
      value: [
        { grapeId: "chardonnay", percentage: 41 },
        { grapeId: "pinot-noir", percentage: 35 },
      ],
      ...src("src-roederer-collection-245"),
      notes: "Os outros 24% são Meunier (uva ainda fora do catálogo).",
    },
    productionMethod: {
      value:
        "55% de vinhos da colheita de 2020, 35% da reserva perpétua (2012 a 2019) e 10% de vinhos de reserva envelhecidos em carvalho; 22% de fermentação malolática; dosagem de 7 g/l.",
      ...src("src-roederer-collection-245"),
    },
  }),
  wine({
    id: "roederer-brut-nature",
    name: "Brut Nature",
    producerId: "louis-roederer",
    countryId: "fr",
    regionId: "champagne",
    type: "espumante",
    sourceId: "src-roederer-brut-nature-2015",
  }),
  wine({
    id: "la-rioja-alta-gran-reserva-904",
    name: "Gran Reserva 904",
    producerId: "la-rioja-alta",
    countryId: "es",
    regionId: "rioja",
    type: "tinto",
    sourceId: "src-riojalta-904",
  }),
  wine({
    id: "lagar-de-cervera",
    name: "Lagar de Cervera",
    producerId: "la-rioja-alta",
    countryId: "es",
    regionId: "rias-baixas",
    type: "branco",
    sourceId: "src-riojalta-lagar-de-cervera",
  }),
  wine({
    id: "catena-zapata-malbec-argentino",
    name: "Catena Zapata Malbec Argentino",
    producerId: "catena-zapata",
    countryId: "ar",
    regionId: "mendoza",
    type: "tinto",
    sourceId: "src-catena-argentino-2021",
  }),
  wine({
    id: "catena-malbec",
    name: "Catena Malbec",
    producerId: "catena-zapata",
    countryId: "ar",
    regionId: "mendoza",
    type: "tinto",
    sourceId: "src-catena-malbec-2022",
  }),
  wine({
    id: "miolo-lote-43",
    name: "Miolo Lote 43",
    producerId: "miolo",
    countryId: "br",
    regionId: "vale-dos-vinhedos",
    type: "tinto",
    sourceId: "src-miolo-lote-43-ficha",
    volumeMl: { value: [750], ...src("src-miolo-lote-43-pagina") },
    servingTemperature: { value: { minC: 16, maxC: 18 }, ...src("src-miolo-lote-43-ficha") },
  }),
];
