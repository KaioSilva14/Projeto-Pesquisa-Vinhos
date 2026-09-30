import "server-only";

import type { DataAdapter } from "@/adapters/types";

import { createGeographyService } from "./geography";
import { createGrapePagesService } from "./grape-pages";
import { createGrapeService } from "./grapes";
import { createPlacePagesService } from "./place-pages";
import { createProducerService } from "./producers";
import { createReferenceService } from "./references";
import { createSearchService } from "./search";
import { createWineListService } from "./wine-list";
import { createWinePageService } from "./wine-page";
import { createWineService } from "./wines";

/** Junta todos os services sobre um mesmo adapter (nos testes, um adapter com dados fictícios). */
export function createCatalogService(adapter: DataAdapter) {
  return {
    ...createGeographyService(adapter),
    ...createPlacePagesService(adapter),
    ...createGrapeService(adapter),
    ...createGrapePagesService(adapter),
    ...createProducerService(adapter),
    ...createWineService(adapter),
    ...createReferenceService(adapter),
    ...createSearchService(adapter),
    ...createWineListService(adapter),
    ...createWinePageService(adapter),
  };
}

export type CatalogService = ReturnType<typeof createCatalogService>;
