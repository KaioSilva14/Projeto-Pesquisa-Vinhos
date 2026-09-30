import type { WineType } from "@/schemas/common";
import type { SparklingSweetness } from "@/schemas/wine";

/** Rótulos dos tipos de vinho na interface (DATA_MODEL.md §4). */
export const WINE_TYPE_LABELS: Record<WineType, string> = {
  tinto: "Tinto",
  branco: "Branco",
  rose: "Rosé",
  espumante: "Espumante",
  fortificado: "Fortificado",
  sobremesa: "De sobremesa",
  laranja: "Laranja",
};

/** Categoria de doçura do espumante, escrita como aparece nos rótulos (ADR-025). */
export const SPARKLING_SWEETNESS_LABELS: Record<SparklingSweetness, string> = {
  "brut-nature": "Brut Nature",
  "extra-brut": "Extra Brut",
  brut: "Brut",
  "extra-dry": "Extra Dry",
  sec: "Sec",
  "demi-sec": "Demi-Sec",
  doux: "Doux",
};
