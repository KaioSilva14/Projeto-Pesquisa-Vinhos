import type { Grape } from "@/schemas/grape";

import { imageIdsOf } from "./images";
import { regions } from "./regions";

// Uvas aprovadas em docs/CURATION.md (ADR-023). Fonte de todos os fatos: ficha da variedade
// no VIVC (src/data/sources.ts), extraída do conteúdo bruto da página em 2026-09-29.
// - Sinônimos: só nomes presentes na lista oficial do VIVC (conferidos um a um); ficam de fora
//   nomes ambíguos na busca (ex.: "Auxerrois", "Malvasia", que também designam outras uvas).
// - Parentesco: só quando o VIVC confirma os DOIS genitores por marcadores genéticos.
// - Origem: país informado pelo VIVC; ausente quando a ficha não informa.
// - Regiões principais (mainRegionIds): derivadas de src/data/regions.ts, com as mesmas fontes
//   que ligam a região à uva (as duas pontas nunca ficam em desacordo).

type GrapeFacts = {
  id: string;
  name: string;
  vivcId: number;
  referenceName?: string;
  color: "tinta" | "branca";
  origin?: string;
  parentage?: string;
  synonyms: [string, ...string[]];
  summary: string;
};

function fromVivc(facts: GrapeFacts): Grape {
  const source = [`src-vivc-${facts.vivcId}`] as [string];
  // Fotos da própria uva cadastradas em ./images.ts (sem foto → "Imagem indisponível")
  const imageIds = imageIdsOf("grape", facts.id);
  // Regiões que citam esta uva como principal, e as fontes dessas ligações
  const linked = regions.filter((region) => region.mainGrapeIds?.value.includes(facts.id));
  const regionSources = [
    ...new Set(linked.flatMap((region) => region.mainGrapeIds?.sourceIds ?? [])),
  ];
  return {
    id: facts.id,
    slug: facts.id,
    status: "published",
    createdAt: "2026-09-29",
    updatedAt: "2026-09-29",
    sourceIds: source,
    ...(imageIds.length > 0 && { imageIds }),
    ...(linked.length > 0 && {
      mainRegionIds: {
        value: linked.map((region) => region.id) as [string, ...string[]],
        sourceIds: regionSources as [string, ...string[]],
      },
    }),
    name: facts.name,
    vivcId: String(facts.vivcId),
    ...(facts.referenceName && {
      referenceName: { value: facts.referenceName, sourceIds: source },
    }),
    color: { value: facts.color, sourceIds: source },
    ...(facts.origin && { origin: { value: facts.origin, sourceIds: source } }),
    ...(facts.parentage && { parentage: { value: facts.parentage, sourceIds: source } }),
    synonyms: { value: facts.synonyms, sourceIds: source },
    summary: { text: facts.summary, basedOnSourceIds: source, writtenAt: "2026-09-29" },
  };
}

export const grapes: Grape[] = [
  fromVivc({
    id: "sangiovese",
    name: "Sangiovese",
    vivcId: 10680,
    color: "tinta",
    origin: "Itália",
    synonyms: ["Brunello", "Morellino", "Prugnolo Gentile", "Nielluccio", "Sangiovese Grosso"],
    summary:
      "Uva tinta de origem italiana. O catálogo internacional de variedades (VIVC) registra mais de cem nomes para ela, entre eles Brunello, Morellino e Prugnolo Gentile. Sobre seus genitores, o VIVC aponta propostas diferentes, sem uma única confirmada.",
  }),
  fromVivc({
    id: "nebbiolo",
    name: "Nebbiolo",
    vivcId: 8417,
    color: "tinta",
    origin: "Itália",
    synonyms: ["Spanna", "Picoutener", "Nebbiolo Lampia"],
    summary:
      "Uva tinta de origem italiana. Também aparece no catálogo internacional de variedades (VIVC) com nomes como Spanna e Picoutener.",
  }),
  fromVivc({
    id: "cabernet-sauvignon",
    name: "Cabernet Sauvignon",
    vivcId: 1929,
    color: "tinta",
    origin: "França",
    parentage: "Cabernet Franc × Sauvignon Blanc",
    synonyms: ["Bouchet", "Petit Cabernet", "Vidure"],
    summary:
      "Uva tinta de origem francesa. Segundo o catálogo internacional de variedades (VIVC), marcadores genéticos confirmam que seus genitores são a Cabernet Franc e a Sauvignon Blanc.",
  }),
  fromVivc({
    id: "merlot",
    name: "Merlot",
    vivcId: 7657,
    referenceName: "Merlot Noir",
    color: "tinta",
    origin: "França",
    parentage: "Magdeleine Noire des Charentes × Cabernet Franc",
    synonyms: ["Merlot", "Bigney", "Merlau"],
    summary:
      "Uva tinta de origem francesa, registrada no catálogo internacional de variedades (VIVC) como Merlot Noir. Marcadores genéticos confirmam como genitores a Magdeleine Noire des Charentes e a Cabernet Franc.",
  }),
  fromVivc({
    id: "chardonnay",
    name: "Chardonnay",
    vivcId: 2455,
    referenceName: "Chardonnay Blanc",
    color: "branca",
    origin: "França",
    parentage: "Heunisch Weiss × Pinot",
    synonyms: ["Chardonnay", "Beaunois", "Pinot Chardonnay"],
    summary:
      "Uva branca de origem francesa, registrada no catálogo internacional de variedades (VIVC) como Chardonnay Blanc. Marcadores genéticos confirmam como genitores a Heunisch Weiss e a Pinot.",
  }),
  fromVivc({
    id: "pinot-noir",
    name: "Pinot Noir",
    vivcId: 9279,
    color: "tinta",
    origin: "França",
    synonyms: ["Pinot Nero", "Spaetburgunder", "Blauburgunder"],
    summary:
      "Uva tinta de origem francesa. O catálogo internacional de variedades (VIVC) registra centenas de nomes para ela, como Pinot Nero e Blauburgunder.",
  }),
  fromVivc({
    id: "tempranillo",
    name: "Tempranillo",
    vivcId: 12350,
    referenceName: "Tempranillo Tinto",
    color: "tinta",
    origin: "Espanha",
    parentage: "Albillo Mayor × Benedicto",
    synonyms: [
      "Tempranillo",
      "Tinta Roriz",
      "Aragonez",
      "Tinto Fino",
      "Tinta del Pais",
      "Ull de Llebre",
      "Cencibel",
    ],
    summary:
      "Uva tinta de origem espanhola, registrada no catálogo internacional de variedades (VIVC) como Tempranillo Tinto. Recebe muitos outros nomes, como Tinta Roriz, Aragonez, Tinto Fino e Cencibel. Marcadores genéticos confirmam como genitores a Albillo Mayor e a Benedicto.",
  }),
  fromVivc({
    id: "albarino",
    name: "Albariño",
    vivcId: 15689,
    referenceName: "Alvarinho",
    color: "branca",
    origin: "Portugal",
    synonyms: ["Albarino", "Alvarinha"],
    summary:
      "Uva branca que o catálogo internacional de variedades (VIVC) registra com o nome de referência Alvarinho e origem em Portugal. Albariño, a forma espanhola do nome, é o nome oficial da uva na Espanha.",
  }),
  fromVivc({
    id: "malbec",
    name: "Malbec",
    vivcId: 2889,
    referenceName: "Cot",
    color: "tinta",
    origin: "França",
    parentage: "Magdeleine Noire des Charentes × Prunelard",
    synonyms: ["Malbec", "Pressac"],
    summary:
      "Uva tinta de origem francesa. No catálogo internacional de variedades (VIVC), seu nome de referência é Cot, e Malbec aparece como sinônimo. Marcadores genéticos confirmam como genitores a Magdeleine Noire des Charentes e a Prunelard.",
  }),
  fromVivc({
    id: "torrontes-riojano",
    name: "Torrontés Riojano",
    vivcId: 15162,
    color: "branca",
    parentage: "Listan Prieto × Muscat of Alexandria",
    synonyms: ["Torrontel", "Torrontel Riojano"],
    summary:
      "Uva branca registrada no catálogo internacional de variedades (VIVC), que confirma por marcadores genéticos seus genitores: a Listan Prieto e a Muscat of Alexandria. A ficha do VIVC não informa o país de origem.",
  }),
];
