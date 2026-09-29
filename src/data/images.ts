import type { ImageAsset } from "@/schemas/image-asset";

// Imagens do catálogo real (IMAGES.md). Arquivos em public/images/.
//
// Uvas (F2-06b): fotos do VIVC, Julius Kühn-Institut (JKI). A janela de cada foto no VIVC diz:
// "This photo can be reproduced. Please quote the source as indicated below" — o crédito abaixo
// é o texto exato indicado pelo JKI para cada foto. Conferido em 2026-09-29. Ver ADR-024.
// A Torrontés Riojano não tem foto no VIVC: continua com "Imagem indisponível".

const JKI_ADDRESS =
  "Julius Kühn-Institut (JKI), Federal Research Centre for Cultivated Plants, Institute for Grapevine Breeding Geilweilerhof - 76833 Siebeldingen, GERMANY";

const credit = {
  bruehl: `Ursula Brühl, ${JKI_ADDRESS}`,
  schneider: `Doris Schneider, ${JKI_ADDRESS}`,
  schneiderBruehl: `Doris Schneider, Ursula Brühl, ${JKI_ADDRESS}`,
};

type GrapePhoto = {
  grapeId: string;
  vivcId: number;
  alt: string;
  width: number;
  height: number;
  credit: string;
};

function vivcPhoto(photo: GrapePhoto): ImageAsset {
  return {
    id: `img-uva-${photo.grapeId}-01`,
    src: `/images/grapes/${photo.grapeId}-01.jpg`,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    credit: photo.credit,
    license: "Reprodução permitida pelo JKI, com citação da fonte",
    sourceUrl: `https://www.vivc.de/index.php?r=passport/photoviewresult&id=${photo.vivcId}`,
    subjectType: "grape",
    subjectId: photo.grapeId,
    modified: "reduzida para 1600 px no lado maior",
    accessedAt: "2026-09-29",
  };
}

export const images: ImageAsset[] = [
  vivcPhoto({
    grapeId: "sangiovese",
    vivcId: 10680,
    width: 1456,
    height: 1600,
    credit: credit.bruehl,
    alt: "Cacho de uvas Sangiovese, de bagas escuras, pendurado em um ramo da videira.",
  }),
  vivcPhoto({
    grapeId: "nebbiolo",
    vivcId: 8417,
    width: 1067,
    height: 1600,
    credit: credit.schneider,
    alt: "Cacho alongado de uvas Nebbiolo, de bagas escuras, na videira entre folhas verdes.",
  }),
  vivcPhoto({
    grapeId: "cabernet-sauvignon",
    vivcId: 1929,
    width: 992,
    height: 1600,
    credit: credit.bruehl,
    alt: "Cacho de uvas Cabernet Sauvignon, de bagas escuras, pendurado na videira entre folhas.",
  }),
  vivcPhoto({
    grapeId: "merlot",
    vivcId: 7657,
    width: 1149,
    height: 1600,
    credit: credit.bruehl,
    alt: "Cacho de uvas Merlot, de bagas escuras, na videira entre folhas verdes.",
  }),
  vivcPhoto({
    grapeId: "chardonnay",
    vivcId: 2455,
    width: 1230,
    height: 1600,
    credit: credit.bruehl,
    alt: "Cacho de uvas Chardonnay, de bagas verde-claras, na videira.",
  }),
  vivcPhoto({
    grapeId: "pinot-noir",
    vivcId: 9279,
    width: 1209,
    height: 1600,
    credit: credit.bruehl,
    alt: "Cacho compacto de uvas Pinot Noir, de bagas escuras, na videira.",
  }),
  vivcPhoto({
    grapeId: "tempranillo",
    vivcId: 12350,
    width: 1067,
    height: 1600,
    credit: credit.schneider,
    alt: "Cacho de uvas Tempranillo, de bagas escuras, na videira entre folhas avermelhadas.",
  }),
  vivcPhoto({
    grapeId: "albarino",
    vivcId: 15689,
    width: 1553,
    height: 1600,
    credit: credit.schneiderBruehl,
    alt: "Cacho de uvas Albariño (Alvarinho), de bagas verde-amareladas, fotografado em laboratório sobre fundo preto, ao lado de uma régua.",
  }),
  vivcPhoto({
    grapeId: "malbec",
    vivcId: 2889,
    width: 1238,
    height: 1600,
    credit: credit.bruehl,
    alt: "Cacho de uvas Malbec, de bagas escuras, diante de uma folha da videira.",
  }),
];
