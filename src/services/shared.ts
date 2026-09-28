import "server-only";

import type { DataAdapter } from "@/adapters/types";
import type { Catalog, CollectionName } from "@/schemas/catalog";

/** Coleções de entidades com status (rascunho/publicado) e slug. */
export type EntityCollection = Exclude<CollectionName, "sources" | "images" | "vintages">;

/** Só itens publicados chegam ao site: rascunhos ficam invisíveis. */
export async function publishedOf<K extends EntityCollection>(
  adapter: DataAdapter,
  collection: K,
): Promise<Catalog[K]> {
  const items = await adapter.getAll(collection);
  return items.filter((item) => item.status === "published") as Catalog[K];
}

/** Ordem alfabética do português (acentos no lugar certo: "Évora" junto de "E"). */
export function sortByName<T extends { name: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

/** Itens na ordem dos ids pedidos, ignorando ids repetidos ou inexistentes. */
export function pickByIds<T extends { id: string }>(
  items: readonly T[],
  ids: readonly string[],
): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return [...new Set(ids)].flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}
