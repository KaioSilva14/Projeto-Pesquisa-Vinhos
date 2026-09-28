import type { z } from "zod";

import { countrySchema, regionSchema, type Country, type Region } from "./geography";
import { grapeSchema, type Grape } from "./grape";
import { imageAssetSchema, type ImageAsset } from "./image-asset";
import { pairingSchema, type Pairing } from "./pairing";
import { producerSchema, winerySchema, type Producer, type Winery } from "./producer";
import { sourceSchema, type Source } from "./source";
import { vintageSchema, type Vintage } from "./vintage";
import { wineSchema, wineStyleSchema, type Wine, type WineStyle } from "./wine";

/** Todas as coleções de dados de um catálogo (real em src/data, demo em src/data/demo). */
export type Catalog = {
  sources: Source[];
  images: ImageAsset[];
  countries: Country[];
  regions: Region[];
  grapes: Grape[];
  producers: Producer[];
  wineries: Winery[];
  styles: WineStyle[];
  wines: Wine[];
  vintages: Vintage[];
  pairings: Pairing[];
};

export type CollectionName = keyof Catalog;

export const catalogSchemas: { [K in CollectionName]: z.ZodType } = {
  sources: sourceSchema,
  images: imageAssetSchema,
  countries: countrySchema,
  regions: regionSchema,
  grapes: grapeSchema,
  producers: producerSchema,
  wineries: winerySchema,
  styles: wineStyleSchema,
  wines: wineSchema,
  vintages: vintageSchema,
  pairings: pairingSchema,
};

export function emptyCatalog(): Catalog {
  return {
    sources: [],
    images: [],
    countries: [],
    regions: [],
    grapes: [],
    producers: [],
    wineries: [],
    styles: [],
    wines: [],
    vintages: [],
    pairings: [],
  };
}
