import "server-only";

import type { DataAdapter } from "@/adapters/types";
import type { FilterOption, FilterOptions } from "@/lib/filters/wine-filters";
import { WINE_TYPE_LABELS } from "@/lib/labels";
import type { WineListItem } from "@/lib/wines/list-item";
import { wineTypes } from "@/schemas/common";

import { pickByIds, publishedOf, sortByName } from "./shared";

const byLabel = (options: Iterable<FilterOption>) =>
  [...new Map([...options].map((option) => [option.value, option])).values()].sort((a, b) =>
    a.label.localeCompare(b.label, "pt-BR"),
  );

/**
 * Lista de vinhos com os valores de cada filtro e as opções que existem nos dados
 * (ARCHITECTURE.md §9: nenhuma opção de filtro sem vinho).
 */
export function createWineListService(adapter: DataAdapter) {
  async function getWineList(): Promise<{ items: WineListItem[]; options: FilterOptions }> {
    const [wines, vintages, grapes, regions, countries, producers, images] = await Promise.all([
      publishedOf(adapter, "wines"),
      adapter.getAll("vintages"),
      publishedOf(adapter, "grapes"),
      publishedOf(adapter, "regions"),
      publishedOf(adapter, "countries"),
      publishedOf(adapter, "producers"),
      adapter.getAll("images"),
    ]);
    const lookup = <T extends { id: string }>(list: readonly T[]) => {
      const map = new Map(list.map((item) => [item.id, item]));
      return (id: string | undefined) => (id === undefined ? undefined : map.get(id));
    };
    const [grape, region, country, producer] = [
      lookup(grapes),
      lookup(regions),
      lookup(countries),
      lookup(producers),
    ];

    const options = { pais: [], regiao: [], uva: [], produtor: [] } as Record<
      "pais" | "regiao" | "uva" | "produtor",
      FilterOption[]
    >;
    const items = sortByName(wines).map((wine): WineListItem => {
      const wineVintages = vintages.filter((vintage) => vintage.wineId === wine.id);
      const wineGrapes = [
        ...(wine.grapes?.value ?? []),
        ...wineVintages.flatMap((vintage) => vintage.grapes?.value ?? []),
      ].flatMap((item) => grape(item.grapeId) ?? []);
      const [wineRegion, wineCountry, wineProducer] = [
        region(wine.regionId),
        country(wine.countryId),
        producer(wine.producerId),
      ];
      const facet = (entity: { slug: string; name: string } | undefined) =>
        entity ? [{ value: entity.slug, label: entity.name }] : [];

      options.pais.push(...facet(wineCountry));
      options.regiao.push(...facet(wineRegion));
      options.uva.push(...wineGrapes.flatMap(facet));
      options.produtor.push(...facet(wineProducer));

      const place = [wineRegion?.name, wineCountry?.name].filter(Boolean).join(", ");
      const years = wineVintages.map((vintage) => vintage.year);
      const [image] = pickByIds(images, wine.imageIds ?? []);
      return {
        id: wine.id,
        name: wine.name,
        href: `/vinhos/${wine.slug}`,
        ...(wineProducer && { producerName: wineProducer.name }),
        ...(place && { place }),
        typeLabel: WINE_TYPE_LABELS[wine.type.value],
        ...(years.length > 0 && { latestYear: Math.max(...years) }),
        isNonVintage: wine.isNonVintage?.value === true,
        ...(image && { image }),
        facets: {
          tipo: [wine.type.value],
          pais: wineCountry ? [wineCountry.slug] : [],
          regiao: wineRegion ? [wineRegion.slug] : [],
          uva: [...new Set(wineGrapes.map((item) => item.slug))],
          produtor: wineProducer ? [wineProducer.slug] : [],
        },
      };
    });

    const presentTypes = new Set(wines.map((wine) => wine.type.value));
    return {
      items,
      options: {
        // Tipos na ordem do DATA_MODEL.md (tinto, branco, rosé…), não alfabética
        tipo: wineTypes
          .filter((type) => presentTypes.has(type))
          .map((type) => ({ value: type, label: WINE_TYPE_LABELS[type] })),
        pais: byLabel(options.pais),
        regiao: byLabel(options.regiao),
        uva: byLabel(options.uva),
        produtor: byLabel(options.produtor),
      },
    };
  }

  return { getWineList };
}
