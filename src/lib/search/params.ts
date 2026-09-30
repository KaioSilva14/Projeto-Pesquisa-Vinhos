import { z } from "zod";

import { MAX_QUERY_LENGTH } from "./search";
import { searchKinds, type SearchKind } from "./types";

/** Resultados por página em /pesquisa. */
export const SEARCH_PAGE_SIZE = 20;

/** Nome do tipo na URL, em português: /pesquisa?q=malbec&tipo=vinhos */
const KIND_SLUGS: Record<SearchKind, string> = {
  wine: "vinhos",
  grape: "uvas",
  region: "regioes",
  country: "paises",
  producer: "produtores",
};

const kindBySlug = new Map(searchKinds.map((kind) => [KIND_SLUGS[kind], kind]));

// Parâmetro repetido na URL (?q=a&q=b) chega como lista: vale o primeiro
const first = (value: unknown) => (Array.isArray(value) ? value[0] : value);

// Parâmetros vêm do visitante: qualquer valor inválido vira o padrão em vez de gerar erro
const searchPageParamsSchema = z.object({
  q: z
    .preprocess(first, z.string())
    .transform((query) => query.trim().slice(0, MAX_QUERY_LENGTH))
    .catch(""),
  kind: z
    .preprocess(first, z.string())
    .transform((slug) => kindBySlug.get(slug))
    .catch(undefined),
  page: z.preprocess(first, z.coerce.number().int().min(1).max(1000)).catch(1),
});

export type SearchPageParams = { q: string; kind?: SearchKind | undefined; page: number };

/** Lê `q`, `tipo` e `pagina` da URL de /pesquisa. */
export function parseSearchPageParams(
  params: Record<string, string | string[] | undefined>,
): SearchPageParams {
  return searchPageParamsSchema.parse({ q: params.q, kind: params.tipo, page: params.pagina });
}

/** Endereço de /pesquisa com os parâmetros informados (omite os que estão no padrão). */
export function searchHref({ q, kind, page = 1 }: Partial<SearchPageParams>): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (kind) params.set("tipo", KIND_SLUGS[kind]);
  if (page > 1) params.set("pagina", String(page));
  const query = params.toString();
  return query ? `/pesquisa?${query}` : "/pesquisa";
}
