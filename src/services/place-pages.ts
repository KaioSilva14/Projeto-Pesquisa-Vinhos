import "server-only";

import type { DataAdapter } from "@/adapters/types";
import type { EntityListItem, EntityRef } from "@/lib/entity-list";
import { applyFilters } from "@/lib/filters/wine-filters";
import { REGION_LEVEL_LABELS } from "@/lib/labels";
import { countryCitationIds, regionCitationIds } from "@/lib/places/citations";
import type { CountryPageData, RegionGroup, RegionPageData } from "@/lib/places/page-data";
import type { Region } from "@/schemas/geography";

import { pickByIds, publishedOf, sortByName } from "./shared";
import { createWineListService } from "./wine-list";

const regionHref = (region: { slug: string }) => `/regioes/${region.slug}`;
const countryHref = (country: { slug: string }) => `/paises/${country.slug}`;
const ref = (href: (item: { slug: string }) => string) => (item: { name: string; slug: string }) =>
  ({ name: item.name, href: href(item) }) satisfies EntityRef;

/** Listas e páginas de regiões e países, com produtores e vinhos ligados pelos dados. */
export function createPlacePagesService(adapter: DataAdapter) {
  const wineList = createWineListService(adapter);

  async function load() {
    const [regions, countries, grapes, producers, images, sources, list] = await Promise.all([
      publishedOf(adapter, "regions"),
      publishedOf(adapter, "countries"),
      publishedOf(adapter, "grapes"),
      publishedOf(adapter, "producers"),
      adapter.getAll("images"),
      adapter.getAll("sources"),
      wineList.getWineList(),
    ]);
    const imageOf = (imageIds: readonly string[] | undefined) =>
      pickByIds(images, imageIds ?? [])[0];
    const regionItem = (region: Region): EntityListItem => {
      const image = imageOf(region.imageIds);
      return {
        id: region.id,
        name: region.name,
        href: regionHref(region),
        context: region.appellation?.value.category ?? REGION_LEVEL_LABELS[region.level],
        ...(image && { image }),
        wineCount: applyFilters(list.items, { regiao: [region.slug] }).length,
      };
    };
    return { regions, countries, grapes, producers, images, sources, list, imageOf, regionItem };
  }

  async function getRegionGroups(): Promise<RegionGroup[]> {
    const { regions, countries, regionItem } = await load();
    return sortByName(countries).flatMap((country) => {
      const inCountry = sortByName(regions.filter((region) => region.countryId === country.id));
      return inCountry.length > 0
        ? [{ country: ref(countryHref)(country), regions: inCountry.map(regionItem) }]
        : [];
    });
  }

  async function getRegionPage(slug: string): Promise<RegionPageData | undefined> {
    const { regions, countries, grapes, producers, sources, list, imageOf } = await load();
    const region = regions.find((item) => item.slug === slug);
    if (!region) return undefined;

    const country = countries.find((item) => item.id === region.countryId);
    const parent = regions.find((item) => item.id === region.parentId);
    const image = imageOf(region.imageIds);
    return {
      region,
      ...(country && { country }),
      ...(parent && { parent: ref(regionHref)(parent) }),
      children: sortByName(regions.filter((item) => item.parentId === region.id)).map(
        ref(regionHref),
      ),
      grapes: pickByIds(grapes, region.mainGrapeIds?.value ?? []).map(
        ref((grape) => `/uvas/${grape.slug}`),
      ),
      producers: sortByName(
        producers.filter((producer) => producer.regionIds?.includes(region.id)),
      ).map(ref((producer) => `/produtores/${producer.slug}`)),
      wines: applyFilters(list.items, { regiao: [region.slug] }),
      ...(image && { image }),
      sources: pickByIds(sources, regionCitationIds(region)),
    };
  }

  async function getCountryList(): Promise<EntityListItem[]> {
    const { regions, countries, list, imageOf } = await load();
    return sortByName(countries).map((country) => {
      const count = regions.filter((region) => region.countryId === country.id).length;
      const image = imageOf(country.imageIds);
      return {
        id: country.id,
        name: country.name,
        href: countryHref(country),
        context: count === 1 ? "1 região no catálogo" : `${count} regiões no catálogo`,
        ...(image && { image }),
        wineCount: applyFilters(list.items, { pais: [country.slug] }).length,
      };
    });
  }

  async function getCountryPage(slug: string): Promise<CountryPageData | undefined> {
    const { regions, countries, producers, sources, list, imageOf, regionItem } = await load();
    const country = countries.find((item) => item.slug === slug);
    if (!country) return undefined;

    const image = imageOf(country.imageIds);
    const own = sortByName(regions.filter((region) => region.countryId === country.id));
    const mapPoints = own.flatMap((region) =>
      region.coordinates
        ? [
            {
              name: region.name,
              href: `/regioes/${region.slug}`,
              ...region.coordinates.value,
              sourceIds: region.coordinates.sourceIds,
            },
          ]
        : [],
    );
    return {
      country,
      regions: own.map(regionItem),
      mapPoints,
      producers: sortByName(producers.filter((producer) => producer.countryId === country.id)).map(
        ref((producer) => `/produtores/${producer.slug}`),
      ),
      wines: applyFilters(list.items, { pais: [country.slug] }),
      ...(image && { image }),
      // Fontes do texto do país e, depois, dos pontos do mapa (na ordem da página)
      sources: pickByIds(sources, [
        ...countryCitationIds(country),
        ...mapPoints.flatMap((point) => point.sourceIds),
      ]),
    };
  }

  const slugsOf = async (collection: "regions" | "countries") =>
    (await publishedOf(adapter, collection)).map((item) => item.slug);

  return {
    listRegionSlugs: () => slugsOf("regions"),
    listCountrySlugs: () => slugsOf("countries"),
    getRegionGroups,
    getRegionPage,
    getCountryList,
    getCountryPage,
  };
}
