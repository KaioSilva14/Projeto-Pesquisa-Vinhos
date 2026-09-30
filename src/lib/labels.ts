import type { SearchKind } from "@/lib/search/types";
import type { WineType } from "@/schemas/common";
import type { Source } from "@/schemas/source";
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

/** Tipo de resultado da busca, no singular (linha do resultado) e no plural (filtro). */
export const SEARCH_KIND_LABELS: Record<SearchKind, { one: string; many: string }> = {
  wine: { one: "Vinho", many: "Vinhos" },
  grape: { one: "Uva", many: "Uvas" },
  region: { one: "Região", many: "Regiões" },
  country: { one: "País", many: "Países" },
  producer: { one: "Produtor", many: "Produtores" },
};

/** Tipo de fonte, na lista "Fontes" (DATA_SOURCES.md §1). */
export const SOURCE_KIND_LABELS: Record<Source["kind"], string> = {
  producer: "Produtor",
  winery: "Vinícola",
  "official-distributor": "Distribuidor oficial",
  institution: "Instituição",
  "specialized-database": "Base especializada",
  technical: "Documento técnico",
  other: "Outra fonte",
};
