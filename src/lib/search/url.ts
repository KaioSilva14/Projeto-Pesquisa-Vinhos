import type { SearchKind } from "./types";

// Montagem da URL de /pesquisa, usada também no navegador (autocomplete): sem Zod aqui.

/** Resultados por página em /pesquisa. */
export const SEARCH_PAGE_SIZE = 20;

/** Nome do tipo na URL, em português: /pesquisa?q=malbec&tipo=vinhos */
export const KIND_SLUGS: Record<SearchKind, string> = {
  wine: "vinhos",
  grape: "uvas",
  region: "regioes",
  country: "paises",
  producer: "produtores",
};

export type SearchPageParams = { q: string; kind?: SearchKind | undefined; page: number };

/** Endereço de /pesquisa com os parâmetros informados (omite os que estão no padrão). */
export function searchHref({ q, kind, page = 1 }: Partial<SearchPageParams>): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (kind) params.set("tipo", KIND_SLUGS[kind]);
  if (page > 1) params.set("pagina", String(page));
  const query = params.toString();
  return query ? `/pesquisa?${query}` : "/pesquisa";
}
