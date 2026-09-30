import type { ImageAsset } from "@/schemas/image-asset";

/** Um item das listas de uvas, regiões, países e produtores (card com foto e contagem). */
export type EntityListItem = {
  id: string;
  name: string;
  href: string;
  /** Uma linha de contexto, ex.: "Uva tinta · Itália", "DOCG". */
  context?: string;
  image?: ImageAsset;
  /** Vinhos do catálogo ligados a esta entidade. */
  wineCount: number;
};

/** Um lugar ou entidade citado com link (nome + endereço). */
export type EntityRef = { name: string; href: string };
