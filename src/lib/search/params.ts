// Só no servidor (página /pesquisa): o Zod não deve ir para o navegador. O que o navegador
// precisa (montar a URL) fica em ./url.ts.
import "server-only";

import { z } from "zod";

import { MAX_QUERY_LENGTH } from "./search";
import { searchKinds } from "./types";
import { KIND_SLUGS, type SearchPageParams } from "./url";

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

/** Lê `q`, `tipo` e `pagina` da URL de /pesquisa. */
export function parseSearchPageParams(
  params: Record<string, string | string[] | undefined>,
): SearchPageParams {
  return searchPageParamsSchema.parse({ q: params.q, kind: params.tipo, page: params.pagina });
}
