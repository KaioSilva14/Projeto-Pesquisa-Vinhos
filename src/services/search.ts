import "server-only";

import type { DataAdapter } from "@/adapters/types";
import { buildSearchDocuments } from "@/lib/search/documents";

import { publishedOf, sortByName } from "./shared";

/** Índice de busca: só entidades publicadas, em ordem alfabética dentro de cada tipo. */
export function createSearchService(adapter: DataAdapter) {
  return {
    async getSearchDocuments() {
      const [wines, vintages, grapes, regions, countries, producers] = await Promise.all([
        publishedOf(adapter, "wines"),
        adapter.getAll("vintages"),
        publishedOf(adapter, "grapes"),
        publishedOf(adapter, "regions"),
        publishedOf(adapter, "countries"),
        publishedOf(adapter, "producers"),
      ]);
      return buildSearchDocuments({
        wines: sortByName(wines),
        vintages,
        grapes: sortByName(grapes),
        regions: sortByName(regions),
        countries: sortByName(countries),
        producers: sortByName(producers),
      });
    },
  };
}
