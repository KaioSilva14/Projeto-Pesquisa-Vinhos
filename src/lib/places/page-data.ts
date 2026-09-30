import type { EntityListItem, EntityRef } from "@/lib/entity-list";
import type { WineListItem } from "@/lib/wines/list-item";
import type { Country, Region } from "@/schemas/geography";
import type { ImageAsset } from "@/schemas/image-asset";
import type { Source } from "@/schemas/source";

// Dados das páginas de regiões e países, montados em services/place-pages.ts.

export type RegionGroup = { country: EntityRef; regions: EntityListItem[] };

export type RegionPageData = {
  region: Region;
  country?: Country;
  parent?: EntityRef;
  /** Sub-regiões e denominações dentro desta região. */
  children: EntityRef[];
  /** Uvas principais publicadas, na ordem da fonte. */
  grapes: EntityRef[];
  producers: EntityRef[];
  wines: WineListItem[];
  image?: ImageAsset;
  /** Fontes citadas, na ordem em que aparecem na página. */
  sources: Source[];
};

export type CountryPageData = {
  country: Country;
  regions: EntityListItem[];
  producers: EntityRef[];
  wines: WineListItem[];
  image?: ImageAsset;
  sources: Source[];
};
