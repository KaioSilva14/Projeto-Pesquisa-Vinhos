import { normalize } from "@/lib/normalize";

import type { SearchDocument, SearchResult } from "./types";

// Busca tolerante a erros de digitação e acentos (ARCHITECTURE.md §8, ADR-026). Compara palavra
// com palavra: "tinto" não casa com "argentino" só porque "tino" aparece dentro dele. O mesmo
// código roda no autocomplete (navegador) e na página /pesquisa (servidor).

/** Limites que protegem a busca de entradas gigantes. */
export const MAX_QUERY_LENGTH = 100;
const MAX_TERMS = 8;

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

/** Erros de digitação tolerados: nenhum em termos curtos, 1 até 7 letras, 2 a partir de 8. */
function allowedTypos(term: string): number {
  if (term.length < 4) return 0;
  return term.length < 8 ? 1 : 2;
}

/**
 * Distância entre duas palavras: letras trocadas, faltando, sobrando ou invertidas ("malbce").
 * Para de calcular quando passa de `max` (só interessa saber se cabe no limite).
 */
export function typoDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let beforePrevious: number[] = [];
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, beforePrevious[j - 2]! + 1);
      }
      current.push(value);
      rowMin = Math.min(rowMin, value);
    }
    if (rowMin > max) return max + 1;
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length]!;
}

/**
 * Qualidade do encontro entre um termo e uma palavra (0 = idêntico; undefined = não casa).
 * Aceita a palavra inteira, o começo dela (quem ainda está digitando) e grafias parecidas.
 */
function matchWord(term: string, word: string): number | undefined {
  if (word === term) return 0;
  if (word.startsWith(term)) return 0.15;
  const max = allowedTypos(term);
  if (max === 0) return undefined;
  const whole = typoDistance(term, word, max);
  if (whole <= max) return 0.3 + (0.3 * whole) / term.length;
  // Erro no começo de uma palavra mais longa só a partir de 6 letras: em termos curtos isso
  // traria ruído ("napa" casaria com o começo de "Zapata")
  if (term.length < 6) return undefined;
  const start = typoDistance(term, word.slice(0, term.length), max);
  if (start <= max) return 0.45 + (0.3 * start) / term.length;
  return undefined;
}

/** Acertar o nome vale mais que acertar uma palavra extra ou o subtítulo. */
const FIELD_PENALTY = { name: 0, keywords: 0.2, subtitle: 0.25 } as const;
type Field = keyof typeof FIELD_PENALTY;

type Entry = { document: SearchDocument; words: Record<Field, string[]> };

const wordsOf = (text: string) => [...new Set(normalize(text).split(" ").filter(Boolean))];

function bestMatch(term: string, entry: Entry): { score: number; inName: boolean } | undefined {
  let best: { score: number; inName: boolean } | undefined;
  for (const field of Object.keys(FIELD_PENALTY) as Field[]) {
    for (const word of entry.words[field]) {
      const quality = matchWord(term, word);
      if (quality === undefined) continue;
      const score = quality + FIELD_PENALTY[field];
      if (!best || score < best.score) best = { score, inName: field === "name" };
    }
  }
  return best;
}

/** Nota do documento: todos os termos precisam casar ("tinto frances" = tinto E francês). */
function scoreEntry(terms: readonly string[], entry: Entry): number | undefined {
  let total = 0;
  let nameHits = 0;
  for (const term of terms) {
    const match = bestMatch(term, entry);
    if (!match) return undefined;
    total += match.score;
    if (match.inName) nameHits++;
  }
  // Entre nomes que casam, prefere o que a consulta cobre mais: "rioja" → Rioja antes de
  // "La Rioja Alta"
  const nameWords = entry.words.name.length;
  const coverage = nameWords > 0 ? Math.min(nameHits / nameWords, 1) : 0;
  return total / terms.length + (nameHits > 0 ? 0.1 * (1 - coverage) : 0);
}

export type Searcher = (query: string, limit?: number) => SearchResult[];

/** Prepara os documentos uma vez e devolve a função de busca. */
export function createSearcher(documents: readonly SearchDocument[]): Searcher {
  const entries: Entry[] = documents.map((document) => ({
    document,
    words: {
      name: wordsOf(document.name),
      keywords: wordsOf((document.keywords ?? []).join(" ")),
      subtitle: wordsOf(document.subtitle ?? ""),
    },
  }));

  return (query, limit) => {
    const terms = queryTerms(query);
    if (terms.length === 0) return [];

    const results: SearchResult[] = [];
    for (const entry of entries) {
      const score = scoreEntry(terms, entry);
      if (score !== undefined) results.push({ document: entry.document, score });
    }
    results.sort(
      (a, b) => a.score - b.score || a.document.name.localeCompare(b.document.name, "pt-BR"),
    );
    return limit === undefined ? results : results.slice(0, limit);
  };
}
