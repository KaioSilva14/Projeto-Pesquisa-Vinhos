import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { pickByIds, publishedOf, sortByName } from "./shared";

export function createGrapeService(adapter: DataAdapter) {
  const grapes = () => publishedOf(adapter, "grapes");

  return {
    async listGrapes() {
      return sortByName(await grapes());
    },

    async getGrapeBySlug(slug: string) {
      return (await grapes()).find((grape) => grape.slug === slug);
    },

    /** Uvas na ordem pedida (ex.: composição de um vinho), ignorando as não publicadas. */
    async getGrapesByIds(ids: readonly string[]) {
      return pickByIds(await grapes(), ids);
    },
  };
}
