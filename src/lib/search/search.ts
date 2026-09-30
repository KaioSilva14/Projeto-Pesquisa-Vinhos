import Fuse, { type Expression, type IFuseOptions } from "fuse.js";

import { normalize } from "@/lib/normalize";

import type { SearchDocument, SearchResult } from "./types";

// Busca tolerante a erros de digitação e acentos (ARCHITECTURE.md §8, ADR-008). O mesmo código
// roda no autocomplete (navegador) e na página /pesquisa (servidor).

/** Limites que protegem a busca de entradas gigantes. */
export const MAX_QUERY_LENGTH = 100;
const MAX_TERMS = 8;

/** Campos pesquisados e peso de cada um: acertar o nome vale mais. */
const FIELDS = [
  { name: "name", weight: 0.6 },
  { name: "keywords", weight: 0.2 },
  { name: "subtitle", weight: 0.2 },
] as const;

type Entry = { document: SearchDocument } & Record<(typeof FIELDS)[number]["name"], string>;

const OPTIONS: IFuseOptions<Entry> = {
  keys: [...FIELDS],
  // 0 exige texto idêntico, 1 aceita qualquer coisa. 0,35 aceita cerca de 1 erro a cada 3 letras.
  threshold: 0.35,
  // Procura o termo em qualquer posição do texto, não só no começo
  ignoreLocation: true,
  includeScore: true,
};

/** Palavras genéricas que não ajudam a achar nada: "vinho argentino" = "argentino". */
const STOPWORDS = new Set(
  ["vinho", "vinhos", "uva", "uvas", "de", "da", "do", "das", "dos", "em", "com", "para"].map(
    normalize,
  ),
);

/**
 * Termos da consulta, já normalizados e sem repetição. Termos de uma letra são ignorados
 * (combinariam com quase tudo); palavras genéricas também, a menos que a consulta só tenha elas.
 */
export function queryTerms(query: string): string[] {
  const terms = [
    ...new Set(
      normalize(query.slice(0, MAX_QUERY_LENGTH))
        .split(" ")
        .filter((term) => term.length > 1),
    ),
  ];
  const meaningful = terms.filter((term) => !STOPWORDS.has(term));
  return (meaningful.length > 0 ? meaningful : terms).slice(0, MAX_TERMS);
}

export type Searcher = (query: string, limit?: number) => SearchResult[];

/** Prepara os documentos uma vez e devolve a função de busca. */
export function createSearcher(documents: readonly SearchDocument[]): Searcher {
  const entries: Entry[] = documents.map((document) => ({
    document,
    name: normalize(document.name),
    keywords: normalize((document.keywords ?? []).join(" ")),
    subtitle: normalize(document.subtitle ?? ""),
  }));
  const fuse = new Fuse(entries, OPTIONS);

  return (query, limit) => {
    const terms = queryTerms(query);
    if (terms.length === 0) return [];

    // Cada termo precisa aparecer em algum campo: "tinto frances" = tinto E francês
    const expression: Expression = {
      $and: terms.map((term) => ({ $or: FIELDS.map(({ name }) => ({ [name]: term })) })),
    };
    return fuse
      .search(expression, limit === undefined ? undefined : { limit })
      .map(({ item, score }) => ({ document: item.document, score: score ?? 0 }));
  };
}
