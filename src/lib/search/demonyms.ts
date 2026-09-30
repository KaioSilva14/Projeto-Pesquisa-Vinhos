// Gentílicos dos países do catálogo (ADR-019), para que "tinto francês" ou "vinhos italianos"
// encontrem os itens da França e da Itália. São palavras do português, não dados sobre vinhos.
const DEMONYMS: Readonly<Record<string, readonly string[]>> = {
  it: ["italiano", "italiana"],
  fr: ["francês", "francesa"],
  es: ["espanhol", "espanhola"],
  us: ["americano", "americana", "estadunidense", "norte-americano", "norte-americana"],
  ar: ["argentino", "argentina"],
  br: ["brasileiro", "brasileira"],
};

/** Gentílicos do país pelo código ISO; país sem gentílico cadastrado → lista vazia. */
export function demonymsOf(countryId: string): readonly string[] {
  return DEMONYMS[countryId] ?? [];
}
