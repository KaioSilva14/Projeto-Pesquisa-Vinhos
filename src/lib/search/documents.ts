import { SPARKLING_SWEETNESS_LABELS, WINE_TYPE_LABELS } from "@/lib/labels";
import type { Country, Region } from "@/schemas/geography";
import type { Grape } from "@/schemas/grape";
import type { Producer } from "@/schemas/producer";
import type { Vintage } from "@/schemas/vintage";
import type { Wine } from "@/schemas/wine";

import { demonymsOf } from "./demonyms";
import type { SearchDocument } from "./types";

/** Entidades publicadas que entram no índice. */
export type SearchSource = {
  wines: readonly Wine[];
  vintages: readonly Vintage[];
  grapes: readonly Grape[];
  regions: readonly Region[];
  countries: readonly Country[];
  producers: readonly Producer[];
};

function byId<T extends { id: string }>(items: readonly T[]) {
  const map = new Map(items.map((item) => [item.id, item]));
  return (id: string | undefined) => (id === undefined ? undefined : map.get(id));
}

/** Tira vazios e repetidos, mantendo a ordem. */
function terms(values: readonly (string | undefined)[]): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

/** Subtítulo só quando há contexto para mostrar (nunca texto vazio). */
function subtitle(parts: readonly (string | undefined)[], separator: string) {
  const text = terms(parts).join(separator);
  return text ? { subtitle: text } : {};
}

/**
 * Monta o índice de busca a partir do catálogo. Só usa o que já está nos dados (nomes, tipo,
 * uvas, país): nenhuma informação nova é criada aqui.
 */
export function buildSearchDocuments(data: SearchSource): SearchDocument[] {
  const country = byId(data.countries);
  const region = byId(data.regions);
  const grape = byId(data.grapes);
  const producer = byId(data.producers);

  const countryTerms = (countryId: string) => {
    const found = country(countryId);
    return found ? [found.name, ...demonymsOf(found.id)] : [];
  };
  const place = (regionId: string | undefined, countryId: string) =>
    subtitle([region(regionId)?.name, country(countryId)?.name], ", ");

  // Uvas do vinho: composição do rótulo e de todas as safras registradas
  const grapeNamesOf = (wine: Wine) => {
    const vintageGrapes = data.vintages
      .filter((vintage) => vintage.wineId === wine.id)
      .flatMap((vintage) => vintage.grapes?.value ?? []);
    return [...(wine.grapes?.value ?? []), ...vintageGrapes].map(
      (item) => grape(item.grapeId)?.name,
    );
  };

  const wines = data.wines.map((wine): SearchDocument => ({
    id: `wine:${wine.id}`,
    kind: "wine",
    name: wine.name,
    ...subtitle(
      [producer(wine.producerId)?.name, place(wine.regionId, wine.countryId).subtitle],
      " · ",
    ),
    keywords: terms([
      WINE_TYPE_LABELS[wine.type.value],
      wine.sparklingSweetness && SPARKLING_SWEETNESS_LABELS[wine.sparklingSweetness.value],
      ...grapeNamesOf(wine),
      region(wine.regionId)?.namePt,
      ...countryTerms(wine.countryId),
    ]),
    href: `/vinhos/${wine.slug}`,
  }));

  const grapes = data.grapes.map((item): SearchDocument => ({
    id: `grape:${item.id}`,
    kind: "grape",
    name: item.name,
    ...(item.color && { subtitle: `Uva ${item.color.value}` }),
    keywords: terms([item.referenceName?.value, ...(item.synonyms?.value ?? [])]),
    href: `/uvas/${item.slug}`,
  }));

  const regions = data.regions.map((item): SearchDocument => ({
    id: `region:${item.id}`,
    kind: "region",
    name: item.name,
    ...place(item.parentId, item.countryId),
    keywords: terms([
      item.namePt,
      item.appellation?.value.category,
      ...countryTerms(item.countryId),
    ]),
    href: `/regioes/${item.slug}`,
  }));

  const countries = data.countries.map((item): SearchDocument => ({
    id: `country:${item.id}`,
    kind: "country",
    name: item.name,
    keywords: [...demonymsOf(item.id)],
    href: `/paises/${item.slug}`,
  }));

  const producers = data.producers.map((item): SearchDocument => ({
    id: `producer:${item.id}`,
    kind: "producer",
    name: item.name,
    ...place(item.regionIds?.[0], item.countryId),
    keywords: terms([
      ...(item.regionIds ?? []).map((id) => region(id)?.name),
      ...countryTerms(item.countryId),
    ]),
    href: `/produtores/${item.slug}`,
  }));

  return [...wines, ...grapes, ...regions, ...countries, ...producers];
}
