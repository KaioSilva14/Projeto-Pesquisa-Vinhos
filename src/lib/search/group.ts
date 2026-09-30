import type { SearchKind, SearchResult } from "./types";

export type SuggestionGroup = { kind: SearchKind; results: SearchResult[] };

/**
 * Agrupa as sugestões por tipo (Vinhos, Uvas…), no máximo `perGroup` por grupo. O grupo que
 * tem o resultado mais parecido vem primeiro; dentro dele, a ordem de relevância é mantida.
 */
export function groupResults(
  results: readonly SearchResult[],
  perGroup: number,
): SuggestionGroup[] {
  const groups = new Map<SearchKind, SearchResult[]>();
  for (const result of results) {
    const list = groups.get(result.document.kind) ?? [];
    if (list.length < perGroup) list.push(result);
    groups.set(result.document.kind, list);
  }
  return [...groups].map(([kind, list]) => ({ kind, results: list }));
}
