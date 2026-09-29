import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { publishedOf, sortByName } from "./shared";

export function createProducerService(adapter: DataAdapter) {
  const producers = () => publishedOf(adapter, "producers");

  return {
    async listProducers(filter: { countryId?: string; regionId?: string } = {}) {
      const all = await producers();
      return sortByName(
        all.filter(
          (producer) =>
            (filter.countryId === undefined || producer.countryId === filter.countryId) &&
            (filter.regionId === undefined || (producer.regionIds ?? []).includes(filter.regionId)),
        ),
      );
    },

    async getProducerBySlug(slug: string) {
      return (await producers()).find((producer) => producer.slug === slug);
    },

    async getProducerById(id: string) {
      return (await producers()).find((producer) => producer.id === id);
    },

    /** Vinícolas reais do produtor (só existem quando diferentes do próprio produtor). */
    async listWineriesByProducer(producerId: string) {
      const wineries = await publishedOf(adapter, "wineries");
      return sortByName(wineries.filter((winery) => winery.producerId === producerId));
    },
  };
}
