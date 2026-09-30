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

const grapePhotos: ImageAsset[] = [
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

// Regiões e produtores (F4-08): fotos do Wikimedia Commons com licença livre (CC BY, CC BY-SA,
// CC0), conferida na página de cada arquivo em 2026-09-30. A descrição da página confirma o lugar
// fotografado. Crédito = autor como aparece no Commons. La Rioja Alta: nenhuma foto no Commons.

const LICENSES = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0",
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
} as const;

type CommonsPhoto = {
  subjectType: "region" | "producer";
  subjectId: string;
  /** Nome do arquivo no Commons (sem "File:"). */
  file: string;
  author: string;
  license: keyof typeof LICENSES;
  width: number;
  height: number;
  alt: string;
};

function commonsPhoto(photo: CommonsPhoto): ImageAsset {
  const folder = photo.subjectType === "region" ? "regions" : "producers";
  return {
    id: `img-${photo.subjectType === "region" ? "regiao" : "produtor"}-${photo.subjectId}-01`,
    src: `/images/${folder}/${photo.subjectId}-01.jpg`,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    credit: `${photo.author}, via Wikimedia Commons`,
    license: photo.license,
    licenseUrl: LICENSES[photo.license],
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.file.replaceAll(" ", "_"))}`,
    subjectType: photo.subjectType,
    subjectId: photo.subjectId,
    modified: "reduzida para 1600 px no lado maior",
    accessedAt: "2026-09-30",
  };
}

function commonsPhotos(): ImageAsset[] {
  const region = (data: Omit<CommonsPhoto, "subjectType">) =>
    commonsPhoto({ subjectType: "region", ...data });
  const producer = (data: Omit<CommonsPhoto, "subjectType">) =>
    commonsPhoto({ subjectType: "producer", ...data });
  return [
    region({
      subjectId: "chianti-classico",
      file: "Autunno in Chianti Toscana.jpg",
      author: "Repuli",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 1067,
      alt: "Vinhedos de Chianti Classico no outono, perto de Radda in Chianti, com colinas ao fundo.",
    }),
    region({
      subjectId: "barolo",
      file: "Barolo - view from La Morra in Piemonte, Italy.jpg",
      author: "Megan Mallen",
      license: "CC BY 2.0",
      width: 1600,
      height: 1067,
      alt: "Vilarejo de Barolo cercado de vinhedos nas colinas do Piemonte, visto de La Morra.",
    }),
    region({
      subjectId: "bordeaux",
      file: "Vineyard in the Haut-Medoc.jpg",
      author: "Jonas Roux",
      license: "CC BY 2.0",
      width: 1600,
      height: 1067,
      alt: "Vinhedo em Bégadan, na região de Bordeaux, com a torre de uma igreja ao fundo.",
    }),
    region({
      subjectId: "champagne",
      file: "Blick von Châtillon-sur-Marne über die Weinberge der Champagne 08.jpg",
      author: "JensKunstfreund",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 1102,
      alt: "Vista de Châtillon-sur-Marne sobre os vinhedos de Champagne, com telhados do vilarejo em primeiro plano.",
    }),
    region({
      subjectId: "rioja",
      file: "Viñedos en Rodezno, La Rioja.jpg",
      author: "Nicolás Pérez Gimilio",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 1200,
      alt: "Fileiras de videiras em Rodezno, La Rioja, sob céu azul.",
    }),
    region({
      subjectId: "rias-baixas",
      file: "Viñedos de albariño en la parroquia de Santa Cruz de Castrelo (Cambados).jpg",
      author: "Re Fresh Vigo",
      license: "CC BY-SA 3.0",
      width: 1600,
      height: 1067,
      alt: "Vinhedos de Albariño na paróquia de Santa Cruz de Castrelo, em Cambados, com a ria ao fundo.",
    }),
    region({
      subjectId: "napa-valley",
      file: "Napa valley vineyard and winery.jpg",
      author: "Brocken Inaglory",
      license: "CC BY-SA 3.0",
      width: 1600,
      height: 1398,
      alt: "Vinhedo de Napa Valley com folhas em tons de laranja no outono e uma vinícola ao fundo.",
    }),
    region({
      subjectId: "mendoza",
      file: "Vineyard in Mendoza, Argentina.jpg",
      author: "David",
      license: "CC BY 2.0",
      width: 1600,
      height: 992,
      alt: "Vinhedo perto de Los Árboles, no Valle de Uco, em Mendoza, com a Cordilheira dos Andes ao fundo.",
    }),
    region({
      subjectId: "valle-de-cafayate",
      file: "Cafayate, Argentina.jpg",
      author: "aaepstein",
      license: "CC BY 2.0",
      width: 1600,
      height: 1071,
      alt: "Vinhedo de uma vinícola perto de Cafayate, na província de Salta, com montanhas ao fundo.",
    }),
    region({
      subjectId: "vale-dos-vinhedos",
      file: "PLANTAÇÕES DE UVA - VALE DOS VINHEDOS - RS.jpg",
      author: "STELLA SEGATTI",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 900,
      alt: "Fileiras de videiras identificadas por placas (Marselan e Egiodola) em um vinhedo do Vale dos Vinhedos, RS.",
    }),
    producer({
      subjectId: "chateau-montelena",
      file: "Chateau Montelena Winery.gk.jpg",
      author: "Grendelkhan",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 1197,
      alt: "Fachada de pedra coberta de hera da vinícola Chateau Montelena, em Calistoga, com barris na entrada.",
    }),
    producer({
      subjectId: "chateau-palmer",
      file: "Château Palmer 2015.jpg",
      author: "PA",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 1068,
      alt: "O Château Palmer, prédio com torres de telhado cônico, diante de um gramado.",
    }),
    producer({
      subjectId: "louis-roederer",
      file: "Caves roederer 01371.JPG",
      author: "G.Garitan",
      license: "CC BY-SA 3.0",
      width: 1600,
      height: 898,
      alt: "Prédio das caves da Champagne Louis Roederer, na esquina das ruas Savoye e Champs de Mars.",
    }),
    producer({
      subjectId: "catena-zapata",
      file: "ALTURA Argentina Wine Tourism - Bodega Catena Zapata - panoramio.jpg",
      author: "ArgentinaWineTourism… (Panoramio)",
      license: "CC BY-SA 3.0",
      width: 1600,
      height: 1200,
      alt: "Prédio da Bodega Catena Zapata, em forma de pirâmide escalonada, em Agrelo, Mendoza.",
    }),
    producer({
      subjectId: "miolo",
      file: "Bento Gonçalves - Vinícola Miolo 04.jpg",
      author: "Sintegrity",
      license: "CC BY-SA 4.0",
      width: 1600,
      height: 1200,
      alt: "Garrafas deitadas em fileiras na cave iluminada da Vinícola Miolo, em Bento Gonçalves.",
    }),
    producer({
      subjectId: "gd-vajra",
      file: "G.D. VAJRA Costabella.jpg",
      author: "Isidoro Barolo",
      license: "CC0",
      width: 1600,
      height: 1200,
      alt: "Vinhas velhas no vinhedo Costabella, que o autor da foto identifica como da G.D. Vajra.",
    }),
  ];
}

// Garrafas (F4-08, 2ª parte): fotos publicadas pelo próprio produtor no site oficial, sem licença
// livre. Usadas com crédito, em projeto de estudo sem fins comerciais, por decisão do usuário
// (ADR-028); retiradas a pedido do detentor. Só entram fotos do vinho certo: safra diferente da
// cadastrada nunca entra; safra ilegível na foto fica dita no texto alternativo.
// Sem foto conferida: Montelena Chardonnay (só há a da safra 2023), Roederer Collection 245 e
// Brut Nature (páginas sem imagem acessível), Catena Malbec e Catena Zapata Malbec Argentino
// (só fotos de outra safra ou deitadas em baixa resolução).

const PRODUCER_SITE_LICENSE =
  "Direitos reservados ao produtor; reproduzida sem autorização expressa, com crédito, em projeto de estudo sem fins comerciais (ADR-028)";

type ProducerSitePhoto = {
  wineId: string;
  /** Extensão do arquivo em public/images/wines/. */
  ext: "jpg" | "png" | "webp";
  /** Endereço exato do arquivo no site do produtor. */
  fileUrl: string;
  producer: string;
  width: number;
  height: number;
  alt: string;
  modified?: string;
};

function producerSitePhoto(photo: ProducerSitePhoto): ImageAsset {
  return {
    id: `img-vinho-${photo.wineId}-01`,
    src: `/images/wines/${photo.wineId}-01.${photo.ext}`,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    credit: `${photo.producer} (site oficial)`,
    license: PRODUCER_SITE_LICENSE,
    sourceUrl: photo.fileUrl,
    subjectType: "wine",
    subjectId: photo.wineId,
    ...(photo.modified && { modified: photo.modified }),
    accessedAt: "2026-09-30",
  };
}

const bottlePhotos: ImageAsset[] = [
  producerSitePhoto({
    wineId: "montelena-napa-valley-cabernet-sauvignon",
    ext: "jpg",
    fileUrl: "https://montelena.com/wp-content/uploads/2020/12/CHM_Shop_NapaCab_2018_Detail.png",
    producer: "Chateau Montelena",
    width: 1021,
    height: 1600,
    alt: "Detalhe da garrafa do Chateau Montelena Napa Valley Cabernet Sauvignon 2018, com o rótulo em primeiro plano.",
    modified: "reduzida para 1600 px de altura e convertida para JPEG",
  }),
  producerSitePhoto({
    wineId: "vajra-barolo-albe",
    ext: "png",
    fileUrl: "https://www.gdvajra.it/uploads/public/2237_bottle-nv-barolo-albe.png",
    producer: "G.D. Vajra",
    width: 362,
    height: 976,
    alt: "Garrafa do Barolo Albe, da G.D. Vajra (a safra não é legível na foto).",
  }),
  producerSitePhoto({
    wineId: "vajra-barolo-bricco-delle-viole",
    ext: "png",
    fileUrl:
      "https://www.gdvajra.it/uploads/public/3122_2259-bottle-nv-barolo-bricco-delle-viole.075.png",
    producer: "G.D. Vajra",
    width: 362,
    height: 976,
    alt: "Garrafa do Barolo Bricco delle Viole, da G.D. Vajra (a safra não é legível na foto).",
  }),
  producerSitePhoto({
    wineId: "chateau-palmer",
    ext: "webp",
    fileUrl:
      "https://cdn.prod.website-files.com/63a417a748979747a3239e66/649c412d157dcc572cf05141_chateau-palmer_vins_chateau-palmer_00_cover-p-1600.webp",
    producer: "Château Palmer",
    width: 1600,
    height: 1778,
    alt: "Duas garrafas do Château Palmer, de 750 ml e magnum, diante de uma parede escura (a safra não aparece no rótulo).",
  }),
  producerSitePhoto({
    wineId: "palmer-alter-ego",
    ext: "webp",
    fileUrl:
      "https://cdn.prod.website-files.com/63a417a748979747a3239e66/649c412ec74b1e1d298f2a82_chateau-palmer_vins_alter-ego_00_cover-p-1600.webp",
    producer: "Château Palmer",
    width: 1600,
    height: 1778,
    alt: "Duas garrafas do Alter Ego, do Château Palmer, magnum e 750 ml (a safra não aparece no rótulo).",
  }),
  producerSitePhoto({
    wineId: "la-rioja-alta-gran-reserva-904",
    ext: "png",
    fileUrl: "https://www.riojalta.com/media/GR904_2016.png",
    producer: "La Rioja Alta, S.A.",
    width: 300,
    height: 1061,
    alt: "Garrafa do Gran Reserva 904 2016, da La Rioja Alta.",
  }),
  producerSitePhoto({
    wineId: "lagar-de-cervera",
    ext: "jpg",
    fileUrl: "https://www.riojalta.com/media/Lagar_de_Cervera_2025.jpg",
    producer: "La Rioja Alta, S.A.",
    width: 1271,
    height: 1203,
    alt: "Rótulo do Lagar de Cervera Albariño 2025.",
  }),
  producerSitePhoto({
    wineId: "miolo-lote-43",
    ext: "png",
    fileUrl: "https://institucional.miolo.com.br/wp-content/uploads/2017/08/lote-43.png",
    producer: "Miolo Wine Group",
    width: 259,
    height: 783,
    alt: "Garrafa do Miolo Lote 43 (a safra não é legível na foto).",
  }),
];

export const images: ImageAsset[] = [...grapePhotos, ...commonsPhotos(), ...bottlePhotos];

/** Fotos cadastradas para a entidade (sem foto → "Imagem indisponível"). */
export function imageIdsOf(subjectType: ImageAsset["subjectType"], subjectId: string): string[] {
  return images
    .filter((image) => image.subjectType === subjectType && image.subjectId === subjectId)
    .map((image) => image.id);
}
