import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { publishedOf, sortByName } from "./shared";

export function createWineService(adapter: DataAdapter) {
  const wines = () => publishedOf(adapter, "wines");

  return {
    async listWines() {
      return sortByName(await wines());
    },

    async getWineBySlug(slug: string) {
      return (await wines()).find((wine) => wine.slug === slug);
    },

    async listWinesByProducer(producerId: string) {
      return sortByName((await wines()).filter((wine) => wine.producerId === producerId));
    },

    /** Safras do vinho, da mais recente para a mais antiga. Vinho não publicado → nenhuma. */
    async listVintages(wineId: string) {
      const isPublished = (await wines()).some((wine) => wine.id === wineId);
      if (!isPublished) return [];
      const vintages = await adapter.getAll("vintages");
      return vintages
        .filter((vintage) => vintage.wineId === wineId)
        .sort((a, b) => b.year - a.year);
    },

    async listStyles() {
      return sortByName(await publishedOf(adapter, "styles"));
    },
  };
}
