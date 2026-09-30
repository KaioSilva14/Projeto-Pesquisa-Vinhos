import type { FacetRecord, WineSort } from "@/lib/filters/wine-filters";
import type { ImageAsset } from "@/schemas/image-asset";

/** O que a lista de vinhos precisa de cada vinho: texto do card + valores dos filtros. */
export type WineListItem = FacetRecord & {
  name: string;
  href: string;
  producerName?: string;
  /** "Região, País" com o que estiver cadastrado. */
  place?: string;
  typeLabel: string;
  /** Safra mais recente registrada (com ficha). */
  latestYear?: number;
  isNonVintage: boolean;
  /** Foto da garrafa (só do vinho certo, IMAGES.md §2). */
  image?: ImageAsset;
};

/** Ordena sem alterar a lista original. Sem safra conhecida vai para o fim em "safra". */
export function sortWines(items: readonly WineListItem[], sort: WineSort): WineListItem[] {
  const byName = (a: WineListItem, b: WineListItem) => a.name.localeCompare(b.name, "pt-BR");
  if (sort === "nome") return [...items].sort(byName);
  return [...items].sort(
    (a, b) => (b.latestYear ?? -Infinity) - (a.latestYear ?? -Infinity) || byName(a, b),
  );
}
