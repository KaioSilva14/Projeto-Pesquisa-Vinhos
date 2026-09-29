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
];
