import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { publishedOf } from "./shared";

export type SitemapEntry = { path: string; lastModified: string };

/** Pasta de cada tipo de página de entidade (ARCHITECTURE.md §4). */
const ENTITY_ROUTES = {
  wines: "/vinhos",
  grapes: "/uvas",
  regions: "/regioes",
  countries: "/paises",
  producers: "/produtores",
} as const;

/** Páginas de entidade para o sitemap (SEO.md §5): só publicadas e nunca de demonstração. */
export function createSitemapService(adapter: DataAdapter) {
  async function getEntitySitemapEntries(): Promise<SitemapEntry[]> {
    const groups = await Promise.all(
      (Object.keys(ENTITY_ROUTES) as (keyof typeof ENTITY_ROUTES)[]).map(async (collection) =>
        (await publishedOf(adapter, collection))
          .filter((item) => !item.isDemo)
          .map((item) => ({
            path: `${ENTITY_ROUTES[collection]}/${item.slug}`,
            lastModified: item.updatedAt,
          })),
      ),
    );
    return groups.flat();
  }

  return { getEntitySitemapEntries };
}
