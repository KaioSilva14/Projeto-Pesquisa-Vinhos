import type { Country, Region } from "@/schemas/geography";
import type { ImageAsset } from "@/schemas/image-asset";
import type { Producer } from "@/schemas/producer";
import type { Source } from "@/schemas/source";
import type { Vintage } from "@/schemas/vintage";
import type { Wine } from "@/schemas/wine";

import type { EntityRef } from "@/lib/entity-list";

import type { RelatedGroup } from "./related";

// Dados da página /vinhos/[slug], montados em services/wine-page.ts.

/** Nome e endereço de uma uva citada na composição. */
export type GrapeRef = { name: string; slug: string };

export type WinePageData = {
  wine: Wine;
  producer?: Producer;
  region?: Region;
  country?: Country;
  /** Uvas publicadas citadas pelo vinho ou pelas safras, por id. */
  grapes: Readonly<Record<string, GrapeRef>>;
  /** Da mais recente para a mais antiga. */
  vintages: Vintage[];
  image?: ImageAsset;
  /** Fontes citadas, na ordem em que aparecem na página (numeração da lista "Fontes"). */
  sources: Source[];
  related: RelatedGroup[];
  /** Pratos que o produtor sugere, com link para a página de harmonizações. */
  pairings: EntityRef[];
};
