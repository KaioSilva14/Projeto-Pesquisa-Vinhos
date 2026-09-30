// Filtros da lista de vinhos (ARCHITECTURE.md §9). Funções puras, sem Zod: rodam no servidor
// (lista filtrada) e no navegador (contagens do painel de filtros do celular).

/** Grupos na ordem da tela; a chave é o nome do parâmetro na URL, em português. */
export const FILTER_GROUPS = [
  { key: "tipo", label: "Tipo" },
  { key: "pais", label: "País" },
  { key: "regiao", label: "Região" },
  { key: "uva", label: "Uva" },
  { key: "produtor", label: "Produtor" },
] as const;

export type FilterKey = (typeof FILTER_GROUPS)[number]["key"];
export const FILTER_KEYS: readonly FilterKey[] = FILTER_GROUPS.map((group) => group.key);

/** Valores escolhidos por grupo (slugs). Grupo ausente = sem filtro. */
export type FilterSelection = Partial<Record<FilterKey, readonly string[]>>;

export type FilterOption = { value: string; label: string };
export type FilterOptions = Record<FilterKey, readonly FilterOption[]>;

/** O mínimo de um vinho para filtrar: os valores dele em cada grupo. */
export type FacetRecord = { id: string; facets: Record<FilterKey, readonly string[]> };

export const WINE_SORTS = [
  { value: "nome", label: "Nome (A–Z)" },
  { value: "safra", label: "Safra mais recente" },
] as const;
export type WineSort = (typeof WINE_SORTS)[number]["value"];
export const DEFAULT_WINE_SORT: WineSort = "nome";

/** Vinhos por "página" (o "Carregar mais" soma mais esta quantidade). */
export const WINES_PAGE_SIZE = 24;

/**
 * O vinho atende à seleção? "E" entre grupos, "OU" dentro do mesmo grupo: País = Itália OU
 * França, E Tipo = Tinto. `ignore` deixa um grupo de fora (usado nas contagens).
 */
export function matchesSelection(
  record: FacetRecord,
  selection: FilterSelection,
  ignore?: FilterKey,
): boolean {
  return FILTER_KEYS.every((key) => {
    const chosen = selection[key];
    if (key === ignore || !chosen || chosen.length === 0) return true;
    return chosen.some((value) => record.facets[key].includes(value));
  });
}

export function applyFilters<T extends FacetRecord>(
  records: readonly T[],
  selection: FilterSelection,
): T[] {
  return records.filter((record) => matchesSelection(record, selection));
}

/**
 * Quantos vinhos cada opção do grupo traria, considerando os filtros dos outros grupos.
 * Assim "Itália 3" diz quantos vinhos aparecem ao marcar Itália, mantendo o resto.
 */
export function facetCounts(
  records: readonly FacetRecord[],
  selection: FilterSelection,
  key: FilterKey,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    if (!matchesSelection(record, selection, key)) continue;
    for (const value of new Set(record.facets[key])) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return counts;
}

/** Quantidade de valores escolhidos em todos os grupos. */
export function countSelected(selection: FilterSelection): number {
  return FILTER_KEYS.reduce((total, key) => total + (selection[key]?.length ?? 0), 0);
}

/** Marca ou desmarca um valor, devolvendo uma nova seleção. */
export function toggleValue(
  selection: FilterSelection,
  key: FilterKey,
  value: string,
): FilterSelection {
  const current = selection[key] ?? [];
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  return { ...selection, [key]: next };
}

export type WineListState = { selection: FilterSelection; sort: WineSort; limit: number };

/** Endereço de /vinhos com filtros, ordem e quantidade (omite o que está no padrão). */
export function winesHref({ selection, sort, limit }: Partial<WineListState>): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    for (const value of selection?.[key] ?? []) params.append(key, value);
  }
  if (sort && sort !== DEFAULT_WINE_SORT) params.set("ordem", sort);
  if (limit && limit > WINES_PAGE_SIZE) params.set("mostrar", String(limit));
  const query = params.toString();
  return query ? `/vinhos?${query}` : "/vinhos";
}
