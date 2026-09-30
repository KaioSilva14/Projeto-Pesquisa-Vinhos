import "server-only";

import type { DataAdapter } from "@/adapters/types";
import { applyFilters } from "@/lib/filters/wine-filters";
import { grapeCitationIds } from "@/lib/grapes/citations";
import type { GrapeListItem, GrapePageData } from "@/lib/grapes/page-data";
import { GRAPE_COLOR_LABELS } from "@/lib/labels";

import { pickByIds, publishedOf, sortByName } from "./shared";
import { createWineListService } from "./wine-list";

/** Lista /uvas e página /uvas/[slug], com os vinhos do catálogo que usam cada uva. */
export function createGrapePagesService(adapter: DataAdapter) {
  const wineList = createWineListService(adapter);
  const winesWith = async (slug: string) =>
    applyFilters((await wineList.getWineList()).items, { uva: [slug] });

  async function listGrapeSlugs() {
    return (await publishedOf(adapter, "grapes")).map((grape) => grape.slug);
  }

  async function getGrapeList(): Promise<GrapeListItem[]> {
    const [grapes, images, { items }] = await Promise.all([
      publishedOf(adapter, "grapes"),
      adapter.getAll("images"),
      wineList.getWineList(),
    ]);
    return sortByName(grapes).map((grape) => {
      const context = [grape.color && GRAPE_COLOR_LABELS[grape.color.value], grape.origin?.value]
        .filter(Boolean)
        .join(" · ");
      const [image] = pickByIds(images, grape.imageIds ?? []);
      return {
        id: grape.id,
        name: grape.name,
        href: `/uvas/${grape.slug}`,
        ...(context && { context }),
        ...(image && { image }),
        wineCount: applyFilters(items, { uva: [grape.slug] }).length,
      };
    });
  }

  async function getGrapePage(slug: string): Promise<GrapePageData | undefined> {
    const grape = (await publishedOf(adapter, "grapes")).find((item) => item.slug === slug);
    if (!grape) return undefined;

    const [regions, sources, images, wines] = await Promise.all([
      publishedOf(adapter, "regions"),
      adapter.getAll("sources"),
      adapter.getAll("images"),
      winesWith(slug),
    ]);
    const [image] = pickByIds(images, grape.imageIds ?? []);

    return {
      grape,
      ...(image && { image }),
      regions: sortByName(pickByIds(regions, grape.mainRegionIds?.value ?? [])).map((region) => ({
        name: region.name,
        slug: region.slug,
      })),
      wines,
      sources: pickByIds(sources, grapeCitationIds(grape)),
    };
  }

  return { listGrapeSlugs, getGrapeList, getGrapePage };
}
