import type { EntityListItem } from "@/lib/entity-list";
import type { WineListItem } from "@/lib/wines/list-item";
import type { Grape } from "@/schemas/grape";
import type { ImageAsset } from "@/schemas/image-asset";
import type { Source } from "@/schemas/source";

// Dados das páginas /uvas e /uvas/[slug], montados em services/grape-pages.ts.

/** Um lugar citado com link (região, país). */
export type PlaceRef = { name: string; slug: string };

export type GrapeListItem = EntityListItem;

export type GrapePageData = {
  grape: Grape;
  image?: ImageAsset;
  /** Regiões onde a uva é principal (com fonte), em ordem alfabética. */
  regions: PlaceRef[];
  wines: WineListItem[];
  /** Fontes citadas, na ordem em que aparecem na página. */
  sources: Source[];
};
