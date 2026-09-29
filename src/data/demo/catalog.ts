import { emptyCatalog, type Catalog } from "@/schemas/catalog";

import { demoCountries, demoRegions, demoSources } from "./geography";
import { demoGrapes, demoProducers } from "./grapes-producers";
import { demoPairings, demoStyles, demoVintages, demoWines } from "./wines";

/**
 * Catálogo de DEMONSTRAÇÃO: entidades fictícias ("Vinho Exemplo 01 (demonstração)"), todas com
 * isDemo: true, para testar a interface. Só é carregado com NEXT_PUBLIC_ENABLE_DEMO_DATA=true e
 * é bloqueado em produção (src/config/env.ts). As páginas mostram o selo "Dados de demonstração".
 */
export const demoCatalog: Catalog = {
  ...emptyCatalog(),
  sources: demoSources,
  countries: demoCountries,
  regions: demoRegions,
  grapes: demoGrapes,
  producers: demoProducers,
  styles: demoStyles,
  wines: demoWines,
  vintages: demoVintages,
  pairings: demoPairings,
};
