import type { Catalog, CollectionName } from "@/schemas/catalog";

import type { DataAdapter } from "./types";

/** Adapter que lê catálogos em memória (os arquivos de src/data), unindo-os na ordem dada. */
export function createLocalAdapter(catalogs: readonly Catalog[]): DataAdapter {
  return {
    async getAll<K extends CollectionName>(collection: K): Promise<Catalog[K]> {
      const merged: unknown[] = [];
      for (const catalog of catalogs) merged.push(...catalog[collection]);
      // Conversão segura: todos os itens vieram da mesma coleção K de catálogos tipados; o
      // TypeScript só não consegue provar isso com um tipo genérico
      return merged as Catalog[K];
    },
  };
}
