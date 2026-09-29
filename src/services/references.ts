import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { pickByIds } from "./shared";

/** Fontes e imagens citadas pelas páginas (lista "Fontes", créditos de fotos). */
export function createReferenceService(adapter: DataAdapter) {
  /** Na ordem de citação, sem repetir: vira a lista numerada de fontes da página. */
  async function getSourcesByIds(ids: readonly string[]) {
    return pickByIds(await adapter.getAll("sources"), ids);
  }

  async function getImagesByIds(ids: readonly string[]) {
    return pickByIds(await adapter.getAll("images"), ids);
  }

  /** Foto principal: a primeira da lista da entidade (DATA_MODEL.md §2). */
  async function getMainImage(imageIds: readonly string[] | undefined) {
    const [first] = await getImagesByIds(imageIds ?? []);
    return first;
  }

  return { getSourcesByIds, getImagesByIds, getMainImage };
}
