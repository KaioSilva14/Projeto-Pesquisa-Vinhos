import "server-only";

import type { DataAdapter } from "@/adapters/types";
import { wineCitationIds } from "@/lib/wines/citations";
import type { WinePageData } from "@/lib/wines/page-data";
import { relatedWines } from "@/lib/wines/related";

import { pickByIds, publishedOf } from "./shared";
import { createWineListService } from "./wine-list";

/** Tudo o que a página /vinhos/[slug] mostra, com as relações já resolvidas. */
export function createWinePageService(adapter: DataAdapter) {
  const wineList = createWineListService(adapter);

  async function listWineSlugs() {
    return (await publishedOf(adapter, "wines")).map((wine) => wine.slug);
  }

  async function getWinePage(slug: string): Promise<WinePageData | undefined> {
    const wine = (await publishedOf(adapter, "wines")).find((item) => item.slug === slug);
    if (!wine) return undefined;

    const [producers, regions, countries, grapes, vintages, sources, images, list] =
      await Promise.all([
        publishedOf(adapter, "producers"),
        publishedOf(adapter, "regions"),
        publishedOf(adapter, "countries"),
        publishedOf(adapter, "grapes"),
        adapter.getAll("vintages"),
        adapter.getAll("sources"),
        adapter.getAll("images"),
        wineList.getWineList(),
      ]);

    const wineVintages = vintages
      .filter((vintage) => vintage.wineId === wine.id)
      .sort((a, b) => b.year - a.year);
    const grapeIds = new Set(
      [wine.grapes, ...wineVintages.map((vintage) => vintage.grapes)].flatMap(
        (composition) => composition?.value.map((item) => item.grapeId) ?? [],
      ),
    );
    const producer = producers.find((item) => item.id === wine.producerId);
    const region = regions.find((item) => item.id === wine.regionId);
    const country = countries.find((item) => item.id === wine.countryId);
    const [image] = pickByIds(images, wine.imageIds ?? []);

    return {
      wine,
      ...(producer && { producer }),
      ...(region && { region }),
      ...(country && { country }),
      grapes: Object.fromEntries(
        grapes
          .filter((grape) => grapeIds.has(grape.id))
          .map((grape) => [grape.id, { name: grape.name, slug: grape.slug }]),
      ),
      vintages: wineVintages,
      ...(image && { image }),
      sources: pickByIds(sources, wineCitationIds(wine, wineVintages)),
      related: relatedWines(wine.id, list.items),
    };
  }

  return { listWineSlugs, getWinePage };
}
