import "server-only";

import type { DataAdapter } from "@/adapters/types";
import { PAIRING_CATEGORY_LABELS } from "@/lib/labels";
import type { PairingGroup, PairingsPageData } from "@/lib/pairings/page-data";
import { pairingCategories } from "@/schemas/pairing";

import { pickByIds, publishedOf, sortByName } from "./shared";

/**
 * Página /harmonizacoes: pratos que os produtores sugerem, agrupados por categoria. Só aparecem
 * pratos com pelo menos um vinho; cada sugestão leva a fonte da ficha do produtor.
 */
export function createPairingPagesService(adapter: DataAdapter) {
  async function getPairingsPage(): Promise<PairingsPageData> {
    const [pairings, wines, producers, sources] = await Promise.all([
      publishedOf(adapter, "pairings"),
      publishedOf(adapter, "wines"),
      publishedOf(adapter, "producers"),
      adapter.getAll("sources"),
    ]);
    const producerName = (id: string) => producers.find((producer) => producer.id === id)?.name;

    const groups = pairingCategories.flatMap((category): PairingGroup[] => {
      const items = pairings
        .filter((pairing) => pairing.category === category)
        .map((pairing) => ({
          slug: pairing.slug,
          name: pairing.name,
          ...(pairing.cuisine && { cuisine: pairing.cuisine }),
          wines: sortByName(
            wines
              .filter((wine) => wine.pairingIds?.value.includes(pairing.id))
              .map((wine) => {
                const producer = producerName(wine.producerId);
                return {
                  name: producer ? `${wine.name} (${producer})` : wine.name,
                  href: `/vinhos/${wine.slug}`,
                  sourceIds: wine.pairingIds?.sourceIds ?? [],
                };
              }),
          ),
        }))
        .filter((item) => item.wines.length > 0);
      return items.length > 0
        ? [{ category, label: PAIRING_CATEGORY_LABELS[category], pairings: items }]
        : [];
    });

    const cited = [
      ...new Set(
        groups.flatMap((group) =>
          group.pairings.flatMap((item) => item.wines.flatMap((wine) => wine.sourceIds)),
        ),
      ),
    ];
    return { groups, sources: pickByIds(sources, cited) };
  }

  return { getPairingsPage };
}
