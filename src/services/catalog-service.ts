import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { createGeographyService } from "./geography";
import { createGrapeService } from "./grapes";
import { createProducerService } from "./producers";
import { createReferenceService } from "./references";
import { createWineService } from "./wines";

/** Junta todos os services sobre um mesmo adapter (nos testes, um adapter com dados fictícios). */
export function createCatalogService(adapter: DataAdapter) {
  return {
    ...createGeographyService(adapter),
    ...createGrapeService(adapter),
    ...createProducerService(adapter),
    ...createWineService(adapter),
    ...createReferenceService(adapter),
  };
}

export type CatalogService = ReturnType<typeof createCatalogService>;
