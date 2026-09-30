import type { WineListItem } from "./list-item";

export type RelatedGroup = {
  key: "produtor" | "regiao" | "uva";
  title: string;
  items: WineListItem[];
};

const GROUPS = [
  { key: "produtor", title: "Do mesmo produtor" },
  { key: "regiao", title: "Da mesma região" },
  { key: "uva", title: "Produzidos com a mesma uva" },
] as const;

/**
 * Vinhos relacionados calculados só pelas relações dos dados (CLAUDE.md §12.7): mesmo produtor,
 * mesma região, mesma uva. Um vinho aparece em um grupo só (o primeiro em que se encaixa).
 */
export function relatedWines(
  targetId: string,
  items: readonly WineListItem[],
  limit = 4,
): RelatedGroup[] {
  const target = items.find((item) => item.id === targetId);
  if (!target) return [];
  const used = new Set([targetId]);

  return GROUPS.flatMap(({ key, title }) => {
    const shared = new Set(target.facets[key]);
    const found = items
      .filter((item) => !used.has(item.id) && item.facets[key].some((value) => shared.has(value)))
      .slice(0, limit);
    for (const item of found) used.add(item.id);
    return found.length > 0 ? [{ key, title, items: found }] : [];
  });
}
