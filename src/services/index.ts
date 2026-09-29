// Única porta de acesso aos dados para as páginas (ARCHITECTURE.md §3).
// "server-only": se um Client Component importar este arquivo, o build falha. Assim o
// catálogo inteiro nunca vai para o navegador do visitante.
import "server-only";

import { createLocalAdapter } from "@/adapters/local";
import { env } from "@/config/env";
import { catalog } from "@/data/catalog";
import { demoCatalog } from "@/data/demo/catalog";

import { createCatalogService } from "./catalog-service";

// Dados de demonstração só entram com NEXT_PUBLIC_ENABLE_DEMO_DATA=true (bloqueado em produção
// pelo src/config/env.ts)
const catalogs = env.NEXT_PUBLIC_ENABLE_DEMO_DATA ? [catalog, demoCatalog] : [catalog];

export const catalogService = createCatalogService(createLocalAdapter(catalogs));
