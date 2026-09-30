import type { Source } from "@/schemas/source";

// Fontes do catálogo real (DATA_SOURCES.md §5). Cada fato em src/data cita pelo menos uma delas.

const vivc = (id: number, primeName: string): Source => ({
  id: `src-vivc-${id}`,
  kind: "specialized-database",
  label: `VIVC, ficha da variedade ${primeName} (nº ${id})`,
  publisher: "Julius Kühn-Institut (JKI), Vitis International Variety Catalogue",
  url: `https://www.vivc.de/index.php?r=passport%2Fview&id=${id}`,
  accessedAt: "2026-09-29",
  reliability: "primary",
});

export const sources: Source[] = [
  // F2-06: fichas das 10 uvas aprovadas em docs/CURATION.md
  vivc(10680, "SANGIOVESE"),
  vivc(8417, "NEBBIOLO"),
  vivc(1929, "CABERNET SAUVIGNON"),
  vivc(7657, "MERLOT NOIR"),
  vivc(2455, "CHARDONNAY BLANC"),
  vivc(9279, "PINOT NOIR"),
  vivc(12350, "TEMPRANILLO TINTO"),
  vivc(15689, "ALVARINHO"),
  vivc(2889, "COT"),
  vivc(15162, "TORRONTES RIOJANO"),

  // F2-07: regiões (conteúdo lido no texto bruto de cada página ou PDF, em 2026-09-30)
  {
    id: "src-masaf-chianti-classico",
    kind: "institution",
    label: "Disciplinare di produzione da DOCG Chianti Classico (registro nacional do MASAF)",
    publisher: "Ministero dell'Agricoltura, della Sovranità Alimentare e delle Foreste (Itália)",
    // O site do ministério só funciona em http: o link é a cópia arquivada (https)
    url: "https://web.archive.org/web/20260112225023/http://catalogoviti.politicheagricole.it/scheda_denom.php?t=dsc&q=1023",
    accessedAt: "2026-09-30",
    reliability: "primary",
    notes:
      "Endereço original (só http): http://catalogoviti.politicheagricole.it/scheda_denom.php?t=dsc&q=1023. Versão com alterações até o DM 07.03.2014. A alteração publicada na Gazzetta Ufficiale em 2023 não foi conferida: o site da Gazzetta e o do consórcio estavam inacessíveis em 2026-09-30.",
  },
  {
    id: "src-masaf-barolo",
    kind: "institution",
    label: "Disciplinare di produzione da DOCG Barolo (registro nacional do MASAF)",
    publisher: "Ministero dell'Agricoltura, della Sovranità Alimentare e delle Foreste (Itália)",
    url: "https://web.archive.org/web/20240509193642/http://catalogoviti.politicheagricole.it/scheda_denom.php?t=dsc&q=1011",
    accessedAt: "2026-09-30",
    reliability: "primary",
    notes:
      "Endereço original (só http): http://catalogoviti.politicheagricole.it/scheda_denom.php?t=dsc&q=1011. Versão com alterações até o DM 17.04.2015.",
  },
  {
    id: "src-civb-cepages",
    kind: "institution",
    label: "Les cépages de Bordeaux (distribuição das uvas no vinhedo)",
    publisher: "Conseil Interprofessionnel du Vin de Bordeaux (CIVB)",
    url: "https://www.bordeaux.com/fr/cepages/",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-comite-champagne-appellation",
    kind: "institution",
    label: "L'appellation Champagne",
    publisher: "Comité Champagne",
    url: "https://www.champagne.fr/fr/decouvrir-le-champagne/un-grand-vin-d-assemblage/appellation-champagne",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-comite-champagne-cepages",
    kind: "institution",
    label: "Les cépages en Champagne",
    publisher: "Comité Champagne",
    url: "https://www.champagne.fr/fr/decouvrir-le-champagne/un-grand-vin-d-assemblage/les-cepages-en-champagne",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-doca-rioja-clasificacion",
    kind: "institution",
    label: "Clasificación de vinos DOCa Rioja",
    publisher: "Consejo Regulador de la DOCa Rioja",
    url: "https://www.riojawine.com/doca-rioja/denominacion-de-origen-calificada/",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-doca-rioja-variedades",
    kind: "institution",
    label: "Variedades de uva de la DOCa Rioja",
    publisher: "Consejo Regulador de la DOCa Rioja",
    url: "https://www.riojawine.com/doca-rioja/variedades-de-uva/",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-boe-rias-baixas-1997",
    kind: "institution",
    label:
      "Reglamento de la Denominación de Origen «Rías Baixas» (Orden de 11 de septiembre de 1997)",
    publisher: "Boletín Oficial del Estado (BOE-A-1997-20459)",
    url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-1997-20459",
    accessedAt: "2026-09-30",
    reliability: "primary",
    notes: "Regulamento de 1997; versões posteriores do caderno de especificações não conferidas.",
  },
  {
    id: "src-ttb-avas",
    kind: "institution",
    label: "Established American Viticultural Areas",
    publisher: "Alcohol and Tobacco Tax and Trade Bureau (TTB), governo dos EUA",
    url: "https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/established-avas",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-nvv-fast-facts",
    kind: "institution",
    label: "Napa Valley Fast Facts (variedades por área plantada)",
    publisher: "Napa Valley Vintners",
    url: "https://wine.napavintners.com/fast-facts",
    accessedAt: "2026-09-30",
    reliability: "secondary",
    notes: "Associação de vinícolas do Napa Valley, não é órgão público.",
  },
  {
    id: "src-inv-ig-doc",
    kind: "institution",
    label:
      "Indicaciones Geográficas y Denominaciones de Origen reconocidas y protegidas de la República Argentina",
    publisher: "Instituto Nacional de Vitivinicultura (INV), Argentina",
    url: "https://www.argentina.gob.ar/sites/default/files/i.g._y_d.o.c._de_la_republica_argentina_0.pdf",
    accessedAt: "2026-09-30",
    reliability: "primary",
    notes:
      "No PDF, a coluna de províncias está deslocada uma linha; o tipo (IG/DOC) está alinhado. Números de resolução não registrados por isso.",
  },
  {
    id: "src-inv-malbec-2021",
    kind: "institution",
    label: "Informe de variedad Malbec (Mendoza, março de 2021)",
    publisher: "Instituto Nacional de Vitivinicultura (INV), Argentina",
    url: "https://www.argentina.gob.ar/sites/default/files/2018/10/malbec_2020.pdf",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },
  {
    id: "src-embrapa-do-vale-dos-vinhedos",
    kind: "institution",
    label: "Denominação de Origem Vale dos Vinhedos",
    publisher: "Embrapa Uva e Vinho",
    url: "https://www.embrapa.br/en/uva-e-vinho/indicacoes-geograficas-de-vinhos-do-brasil/do-vale-dos-vinhedos",
    accessedAt: "2026-09-30",
    reliability: "primary",
  },

  // F2-08: fichas técnicas e páginas oficiais dos produtores (texto bruto lido em 2026-09-30)
  producer(
    "src-montelena-cs-2018",
    "Ficha técnica 2018 Napa Valley Cabernet Sauvignon",
    "Chateau Montelena",
    "https://montelena.com/wp-content/uploads/2020/12/2018-Napa-Valley-Cabernet-Sauvignon.pdf",
  ),
  producer(
    "src-montelena-ch-2021",
    "Ficha técnica 2021 Napa Valley Chardonnay",
    "Chateau Montelena",
    "https://montelena.com/wp-content/uploads/2024/06/2021-Napa-Valley-Chardonnay.pdf",
  ),
  producer(
    "src-vajra-albe-2021",
    "Fact sheet Barolo Albe 2021",
    "G.D. Vajra",
    "https://www.gdvajra.it/uploads/public/3188_fact-sheet-2021-barolo-albe-en-1-.pdf",
  ),
  producer(
    "src-vajra-bdv-2022",
    "Fact sheet Barolo Bricco delle Viole 2022",
    "G.D. Vajra",
    "https://www.gdvajra.it/uploads/public/3624_fact-sheet-2022-barolo-bricco-delle-viole-fs-eng.pdf",
  ),
  producer(
    "src-palmer-2022",
    "Vintage sheet 2022 (Château Palmer e Alter Ego)",
    "Château Palmer",
    "https://cdn.prod.website-files.com/63a45b1a311ee6a3ffd1671d/65e22ba9ba0fcbbcd080dee8_Vintage_sheet_EN_2022.pdf",
  ),
  producer(
    "src-palmer-wine-library",
    "The Vintages Library of Château Palmer",
    "Château Palmer",
    "https://www.chateau-palmer.com/en/wine-library",
  ),
  producer(
    "src-roederer-collection-245",
    "Tech sheet Collection 245",
    "Champagne Louis Roederer",
    "https://www.louis-roederer.com/sites/default/files/pdf/lr_tech_sheet_collection_245_en.pdf",
  ),
  producer(
    "src-roederer-brut-nature-2015",
    "Tech sheet Brut Nature 2015",
    "Champagne Louis Roederer",
    "https://www.louis-roederer.com/sites/all/themes/roederer/files/LR_Tech%20sheet_BRUT%20NATURE%202015_Blanc%20EN.pdf",
  ),
  producer(
    "src-riojalta-904",
    "Gran Reserva 904 (página da safra 2016)",
    "La Rioja Alta, S.A.",
    "https://www.riojalta.com/vinos_rioja-alta/gran-reserva-904/",
  ),
  producer(
    "src-riojalta-lagar-de-cervera",
    "Lagar de Cervera (página da safra 2025)",
    "La Rioja Alta, S.A.",
    "https://www.riojalta.com/vinos_lagar-de-fornelos/lagar-de-cervera/",
  ),
  producer(
    "src-catena-argentino-2021",
    "Catena Zapata Malbec Argentino 2021",
    "Bodega Catena Zapata",
    "https://catenazapata.com/catena-zapata-malbec-argentino-2021/",
  ),
  producer(
    "src-catena-malbec-2022",
    "Catena Malbec 2022",
    "Bodega Catena Zapata",
    "https://catenazapata.com/catena-malbec-2022/",
  ),
  producer(
    "src-miolo-lote-43-pagina",
    "Miolo Lote 43 (página do produto, safra 2012)",
    "Miolo Wine Group",
    "https://institucional.miolo.com.br/produtos/miolo-lote-43/",
  ),
  producer(
    "src-miolo-lote-43-ficha",
    "Ficha completa Miolo Lote 43 (ligada à safra 2012 na página do produto)",
    "Miolo Wine Group",
    "https://institucional.miolo.com.br/wp-content/uploads/2017/12/Miolo-Lote-43.pdf",
  ),
];

function producer(id: string, label: string, publisher: string, url: string): Source {
  return {
    id,
    kind: "producer",
    label,
    publisher,
    url,
    accessedAt: "2026-09-30",
    reliability: "primary",
  };
}
