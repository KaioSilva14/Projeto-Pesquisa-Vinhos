import "server-only";

import type { DataAdapter } from "@/adapters/types";
import type { Region } from "@/schemas/geography";

import { publishedOf, sortByName } from "./shared";

type RegionFilter = {
  countryId?: string;
  /** null = só regiões de primeiro nível (sem região-mãe). */
  parentId?: string | null;
};

export function createGeographyService(adapter: DataAdapter) {
  const countries = () => publishedOf(adapter, "countries");
  const regions = () => publishedOf(adapter, "regions");

  return {
    async listCountries() {
      return sortByName(await countries());
    },

    async getCountryBySlug(slug: string) {
      return (await countries()).find((country) => country.slug === slug);
    },

    async listRegions(filter: RegionFilter = {}) {
      const all = await regions();
      return sortByName(
        all.filter(
          (region) =>
            (filter.countryId === undefined || region.countryId === filter.countryId) &&
            (filter.parentId === undefined || (region.parentId ?? null) === filter.parentId),
        ),
      );
    },

    async getRegionBySlug(slug: string) {
      return (await regions()).find((region) => region.slug === slug);
    },

    /**
     * Caminho da região mais ampla até a própria região (ex.: Mendoza → Luján de Cuyo),
     * para a trilha de navegação. Para se a região-mãe não estiver publicada.
     */
    async getRegionPath(region: Region): Promise<Region[]> {
      const byId = new Map((await regions()).map((item) => [item.id, item]));
      const path = [region];
      const seen = new Set([region.id]);
      let parent = region.parentId ? byId.get(region.parentId) : undefined;
      while (parent && !seen.has(parent.id)) {
        path.unshift(parent);
        seen.add(parent.id);
        parent = parent.parentId ? byId.get(parent.parentId) : undefined;
      }
      return path;
    },
  };
}
