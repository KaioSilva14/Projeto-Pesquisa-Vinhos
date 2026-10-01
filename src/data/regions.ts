import type { Region } from "@/schemas/geography";

import { imageIdsOf } from "./images";

// Regiões aprovadas em docs/CURATION.md (ADR-023). Cada fato foi lido no texto bruto da fonte
// oficial citada (src/data/sources.ts) em 2026-09-30.
// - mainGrapeIds: só uvas do catálogo que a fonte aponta como principais/obrigatórias/
//   predominantes na região (a nota explica em que termos). Uvas fora do catálogo (ex.: Meunier)
//   não aparecem, e uvas só "autorizadas" ou "auxiliares" não contam como principais.
// - Valle de Cafayate: sem uvas principais por enquanto. O INV fala da Torrontés Riojano nos
//   "Valles Calchaquíes de Salta" e na região Noroeste inteira, não em Cafayate especificamente.

type Link = { ids: [string, ...string[]]; sourceId: string; notes: string };

function region(
  data: Omit<
    Region,
    "status" | "createdAt" | "updatedAt" | "slug" | "mainGrapeIds" | "sourceIds"
  > & {
    sourceIds: string[];
    grapes?: Link;
  },
): Region {
  const { grapes, ...rest } = data;
  const imageIds = imageIdsOf("region", data.id);
  return {
    ...rest,
    slug: data.id,
    ...(imageIds.length > 0 && { imageIds }),
    status: "published",
    createdAt: "2026-09-30",
    updatedAt: "2026-09-30",
    ...(grapes && {
      mainGrapeIds: { value: grapes.ids, sourceIds: [grapes.sourceId], notes: grapes.notes },
    }),
  };
}

const text = (value: string, sourceIds: [string, ...string[]]) => ({
  text: value,
  basedOnSourceIds: sourceIds,
  writtenAt: "2026-09-30",
});

export const regions: Region[] = [
  region({
    id: "chianti-classico",
    name: "Chianti Classico",
    countryId: "it",
    level: "appellation",
    sourceIds: ["src-masaf-chianti-classico"],
    appellation: {
      value: { system: "Denominazioni di origine (Itália)", category: "DOCG" },
      sourceIds: ["src-masaf-chianti-classico"],
    },
    grapes: {
      ids: ["sangiovese"],
      sourceId: "src-consorzio-chianti-classico-2023",
      notes:
        "Sangiovese de 80% a 100% dos vinhedos; de 90% a 100% na Gran Selezione (art. 2 do disciplinare, com as alterações de 2023).",
    },
    summary: text(
      "Denominação de origem controlada e garantida (DOCG) da Itália. Para o Chianti Classico e o Riserva, o disciplinare exige vinhedos com 80% a 100% de Sangiovese; outras uvas tintas aptas ao cultivo na Toscana podem completar até 20%. Para a Gran Selezione, a alteração de 2023 exige de 90% a 100% de Sangiovese, completados só por uvas de uma lista fechada, como Colorino e Canaiolo, a partir da quinta safra depois da aprovação.",
      ["src-consorzio-chianti-classico-2023"],
    ),
  }),
  region({
    id: "barolo",
    name: "Barolo",
    countryId: "it",
    level: "appellation",
    sourceIds: ["src-masaf-barolo"],
    appellation: {
      value: { system: "Denominazioni di origine (Itália)", category: "DOCG" },
      sourceIds: ["src-masaf-barolo"],
    },
    grapes: {
      ids: ["nebbiolo"],
      sourceId: "src-masaf-barolo",
      notes: "Vinhedos compostos exclusivamente de Nebbiolo (art. 2 do disciplinare).",
    },
    summary: text(
      "Denominação de origem controlada e garantida (DOCG) da Itália. Segundo o regulamento de produção, seus vinhos devem vir de vinhedos plantados exclusivamente com a uva Nebbiolo.",
      ["src-masaf-barolo"],
    ),
  }),
  region({
    id: "bordeaux",
    name: "Bordeaux",
    countryId: "fr",
    level: "region",
    sourceIds: ["src-civb-cepages"],
    grapes: {
      ids: ["merlot", "cabernet-sauvignon"],
      sourceId: "src-civb-cepages",
      notes: "Entre as uvas tintas do vinhedo: Merlot 66%, Cabernet Sauvignon 21% (CIVB).",
    },
    summary: text(
      "Região vinícola francesa que reúne várias denominações de origem. Segundo a interprofissão local (CIVB), entre as uvas tintas plantadas predominam a Merlot (66%), a Cabernet Sauvignon (21%) e a Cabernet Franc (8%).",
      ["src-civb-cepages"],
    ),
  }),
  region({
    id: "champagne",
    name: "Champagne",
    countryId: "fr",
    level: "appellation",
    sourceIds: ["src-comite-champagne-appellation", "src-comite-champagne-cepages"],
    appellation: {
      value: { system: "Appellations d'origine (França)", category: "AOC" },
      sourceIds: ["src-comite-champagne-appellation"],
    },
    grapes: {
      ids: ["pinot-noir", "chardonnay"],
      sourceId: "src-comite-champagne-cepages",
      notes:
        "Duas das três uvas principais: Pinot Noir 38% e Chardonnay 31% do vinhedo (a terceira, Meunier, com 31%, não está no catálogo).",
    },
    summary: text(
      "Denominação de origem controlada (AOC) da França, reconhecida em 1936. Segundo o Comité Champagne, as três uvas mais usadas são a Pinot Noir (38% do vinhedo), a Chardonnay (31%) e a Meunier (31%).",
      ["src-comite-champagne-appellation", "src-comite-champagne-cepages"],
    ),
  }),
  region({
    id: "rioja",
    name: "Rioja",
    countryId: "es",
    level: "appellation",
    sourceIds: ["src-doca-rioja-clasificacion", "src-doca-rioja-variedades"],
    appellation: {
      value: { system: "Denominaciones de origen (Espanha)", category: "DOCa" },
      sourceIds: ["src-doca-rioja-clasificacion"],
    },
    grapes: {
      ids: ["tempranillo"],
      sourceId: "src-doca-rioja-variedades",
      notes: "A Tempranillo ocupa a maior parte dos vinhedos (Consejo Regulador).",
    },
    summary: text(
      "Denominação de origem qualificada (DOCa) da Espanha. Segundo o conselho regulador, a Tempranillo ocupa a maior parte dos vinhedos da denominação.",
      ["src-doca-rioja-clasificacion", "src-doca-rioja-variedades"],
    ),
  }),
  region({
    id: "rias-baixas",
    name: "Rías Baixas",
    countryId: "es",
    level: "appellation",
    sourceIds: ["src-mapa-rias-baixas-pliego"],
    appellation: {
      value: { system: "Denominaciones de origen (Espanha)", category: "DO" },
      sourceIds: ["src-mapa-rias-baixas-pliego"],
    },
    grapes: {
      ids: ["albarino"],
      sourceId: "src-mapa-rias-baixas-pliego",
      notes:
        "Albariño é, com grande diferença, a variedade majoritária; o vinho Rías Baixas Albariño é 100% Albariño (caderno de especificações de 2024).",
    },
    summary: text(
      "Denominação de origem protegida da Espanha, nas províncias de Pontevedra e A Coruña, dividida em cinco subzonas. Segundo o caderno de especificações, a Albariño é, com grande diferença, a uva mais cultivada na região, e boa parte dos vinhos é feita só com ela, vendida como Rías Baixas Albariño.",
      ["src-mapa-rias-baixas-pliego"],
    ),
  }),
  region({
    id: "napa-valley",
    name: "Napa Valley",
    countryId: "us",
    level: "appellation",
    sourceIds: ["src-ttb-avas", "src-nvv-fast-facts"],
    appellation: {
      value: { system: "American Viticultural Areas (EUA)", category: "AVA" },
      sourceIds: ["src-ttb-avas"],
    },
    grapes: {
      ids: ["cabernet-sauvignon"],
      sourceId: "src-nvv-fast-facts",
      notes: "Cabernet Sauvignon com 54% da área de vinhedos (Napa Valley Vintners).",
    },
    summary: text(
      "Área vitícola americana (AVA) do condado de Napa, delimitada no regulamento federal (27 CFR 9.23) e dividida em várias AVAs menores, como Oakville e Rutherford. Segundo a associação de vinícolas local, a Cabernet Sauvignon ocupa 54% da área de vinhedos.",
      ["src-ttb-avas", "src-nvv-fast-facts"],
    ),
  }),
  region({
    id: "mendoza",
    name: "Mendoza",
    countryId: "ar",
    level: "region",
    sourceIds: ["src-inv-ig-doc", "src-inv-malbec-2021"],
    appellation: {
      value: { system: "Indicaciones Geográficas (Argentina)", category: "IG" },
      sourceIds: ["src-inv-ig-doc"],
    },
    grapes: {
      ids: ["malbec"],
      sourceId: "src-inv-malbec-2021",
      notes:
        "O Valle de Uco e a zona Centro de Mendoza concentram 63% da Malbec do país (INV, 2021).",
    },
    summary: text(
      "Indicação geográfica (IG) reconhecida pelo Instituto Nacional de Vitivinicultura (INV) da Argentina. Segundo relatório do INV de 2021, o Valle de Uco e a zona Centro de Mendoza concentram 63% da Malbec plantada no país.",
      ["src-inv-ig-doc", "src-inv-malbec-2021"],
    ),
  }),
  region({
    id: "valle-de-cafayate",
    name: "Valle de Cafayate",
    countryId: "ar",
    level: "appellation",
    sourceIds: ["src-inv-ig-doc"],
    appellation: {
      value: { system: "Indicaciones Geográficas (Argentina)", category: "IG" },
      sourceIds: ["src-inv-ig-doc"],
    },
    summary: text(
      "Indicação geográfica (IG) da província de Salta, na Argentina. Segundo o INV, só a expressão Valle de Cafayate pode ser usada, porque Cafayate é uma marca registrada no país.",
      ["src-inv-ig-doc"],
    ),
  }),
  region({
    id: "vale-dos-vinhedos",
    name: "Vale dos Vinhedos",
    countryId: "br",
    level: "appellation",
    sourceIds: ["src-embrapa-do-vale-dos-vinhedos"],
    appellation: {
      value: { system: "Indicações Geográficas (Brasil, INPI)", category: "DO" },
      sourceIds: ["src-embrapa-do-vale-dos-vinhedos"],
    },
    grapes: {
      ids: ["merlot", "chardonnay", "pinot-noir"],
      sourceId: "src-embrapa-do-vale-dos-vinhedos",
      notes:
        "Merlot obrigatória nos tintos finos, Chardonnay nos brancos finos, Chardonnay e/ou Pinot Noir nos espumantes finos da DO (Embrapa).",
    },
    summary: text(
      "Primeira denominação de origem (DO) de vinhos do Brasil, reconhecida em 2012; em 2002 a região já tinha obtido do INPI a indicação de procedência (IP). Segundo a Embrapa, a Merlot é obrigatória nos tintos finos da DO, a Chardonnay nos brancos finos, e a Chardonnay e/ou a Pinot Noir nos espumantes finos.",
      ["src-embrapa-do-vale-dos-vinhedos"],
    ),
  }),
];
