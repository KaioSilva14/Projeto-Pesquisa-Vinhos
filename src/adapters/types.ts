import type { Catalog, CollectionName } from "@/schemas/catalog";

/**
 * De onde os dados vêm (ARCHITECTURE.md §7). Hoje: arquivos locais. No futuro: banco ou API.
 * Os services só conhecem esta interface, então trocar a origem não muda nenhuma página.
 * Assíncrona desde já para que uma origem remota não exija reescrever os services.
 */
export interface DataAdapter {
  getAll<K extends CollectionName>(collection: K): Promise<Catalog[K]>;
}
