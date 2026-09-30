import "server-only";

import type { DataAdapter } from "@/adapters/types";
import type { EntityListItem } from "@/lib/entity-list";
import { applyFilters } from "@/lib/filters/wine-filters";
import { producerCitationIds, type ProducerPageData } from "@/lib/producers/page-data";

import { pickByIds, publishedOf, sortByName } from "./shared";
import { createWineListService } from "./wine-list";

/** Lista /produtores e página /produtores/[slug], com os vinhos de cada produtor. */
export function createProducerPagesService(adapter: DataAdapter) {
  const wineList = createWineListService(adapter);

  async function load() {
    const [producers, regions, countries, images, sources, list] = await Promise.all([
      publishedOf(adapter, "producers"),
      publishedOf(adapter, "regions"),
      publishedOf(adapter, "countries"),
      adapter.getAll("images"),
      adapter.getAll("sources"),
      wineList.getWineList(),
    ]);
    const regionsOf = (ids: readonly string[] | undefined) => pickByIds(regions, ids ?? []);
    const countryOf = (id: string) => countries.find((country) => country.id === id);
    const imageOf = (ids: readonly string[] | undefined) => pickByIds(images, ids ?? [])[0];
    return { producers, sources, list, regionsOf, countryOf, imageOf };
  }

  async function getProducerList(): Promise<EntityListItem[]> {
    const { producers, list, regionsOf, countryOf, imageOf } = await load();
    return sortByName(producers).map((producer) => {
      const context = [
        ...regionsOf(producer.regionIds).map((region) => region.name),
        countryOf(producer.countryId)?.name,
      ]
        .filter(Boolean)
        .join(" · ");
      const image = imageOf(producer.imageIds);
      return {
        id: producer.id,
        name: producer.name,
        href: `/produtores/${producer.slug}`,
        ...(context && { context }),
        ...(image && { image }),
        wineCount: applyFilters(list.items, { produtor: [producer.slug] }).length,
      };
    });
  }

  async function getProducerPage(slug: string): Promise<ProducerPageData | undefined> {
    const { producers, sources, list, regionsOf, countryOf, imageOf } = await load();
    const producer = producers.find((item) => item.slug === slug);
    if (!producer) return undefined;

    const country = countryOf(producer.countryId);
    const image = imageOf(producer.imageIds);
    return {
      producer,
      ...(country && { country }),
      regions: regionsOf(producer.regionIds).map((region) => ({
        name: region.name,
        href: `/regioes/${region.slug}`,
      })),
      wines: applyFilters(list.items, { produtor: [producer.slug] }),
      ...(image && { image }),
      sources: pickByIds(sources, producerCitationIds(producer)),
    };
  }

  async function listProducerSlugs() {
    return (await publishedOf(adapter, "producers")).map((producer) => producer.slug);
  }

  return { listProducerSlugs, getProducerList, getProducerPage };
}
