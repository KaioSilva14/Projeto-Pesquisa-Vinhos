import { emptyCatalog, type Catalog } from "@/schemas/catalog";

/**
 * Catálogo de DEMONSTRAÇÃO: entidades fictícias ("Vinho Exemplo 01"), todas com isDemo: true,
 * para testar a interface. Só é carregado com NEXT_PUBLIC_ENABLE_DEMO_DATA=true e nunca em
 * produção. Preenchido na F2-04.
 */
export const demoCatalog: Catalog = emptyCatalog();
