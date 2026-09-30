// Só no servidor (página /vinhos): o Zod não deve ir para o navegador.
import "server-only";

import { z } from "zod";

import {
  DEFAULT_WINE_SORT,
  FILTER_KEYS,
  WINE_SORTS,
  WINES_PAGE_SIZE,
  type FilterKey,
  type FilterOptions,
  type FilterSelection,
  type WineListState,
} from "./wine-filters";

const MAX_VALUES_PER_GROUP = 20;
const SLUG = /^[a-z0-9-]{1,80}$/;

// Parâmetro repetido na URL (?pais=a&pais=b) chega como lista; um só chega como texto
const asList = (value: unknown) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];
const first = (value: unknown) => (Array.isArray(value) ? value[0] : value);

// Parâmetros vêm do visitante: valores inválidos são ignorados em vez de gerar erro
const slugList = z
  .preprocess(asList, z.array(z.string()))
  .transform((values) =>
    [...new Set(values.filter((value) => SLUG.test(value)))].slice(0, MAX_VALUES_PER_GROUP),
  )
  .catch([]);

const wineListParamsSchema = z.object({
  ...(Object.fromEntries(FILTER_KEYS.map((key) => [key, slugList])) as Record<
    FilterKey,
    typeof slugList
  >),
  ordem: z.preprocess(first, z.enum(WINE_SORTS.map((sort) => sort.value))).catch(DEFAULT_WINE_SORT),
  mostrar: z
    .preprocess(first, z.coerce.number().int().min(WINES_PAGE_SIZE).max(1000))
    .catch(WINES_PAGE_SIZE),
});

/** Lê filtros, ordem e quantidade da URL de /vinhos. */
export function parseWineListParams(
  params: Record<string, string | string[] | undefined>,
): WineListState {
  const parsed = wineListParamsSchema.parse(params);
  const selection: FilterSelection = {};
  for (const key of FILTER_KEYS) {
    if (parsed[key].length > 0) selection[key] = parsed[key];
  }
  return { selection, sort: parsed.ordem, limit: parsed.mostrar };
}

/** Descarta valores que não existem nos dados (ex.: ?pais=atlantida). */
export function keepKnownValues(
  selection: FilterSelection,
  options: FilterOptions,
): FilterSelection {
  const known: FilterSelection = {};
  for (const key of FILTER_KEYS) {
    const values = options[key].map((option) => option.value);
    const kept = (selection[key] ?? []).filter((value) => values.includes(value));
    if (kept.length > 0) known[key] = kept;
  }
  return known;
}
