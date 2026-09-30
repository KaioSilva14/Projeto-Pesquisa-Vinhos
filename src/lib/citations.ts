// Notas de fonte das páginas de entidade: cada fato mostra o número da fonte ("¹"), e a lista
// "Fontes" no fim segue a mesma numeração, na ordem em que as fontes aparecem na página.

/** Qualquer coisa que cita fontes: valor com fonte (`Sourced`) ou texto editorial. */
export type Cited =
  { readonly sourceIds: readonly string[] } | { readonly basedOnSourceIds: readonly string[] };

const idsOf = (item: Cited | undefined): readonly string[] =>
  !item ? [] : "sourceIds" in item ? item.sourceIds : item.basedOnSourceIds;

/** Fontes citadas, sem repetir, na ordem recebida (use a ordem das seções da tela). */
export function citationIds(cited: readonly (Cited | undefined)[]): string[] {
  return [...new Set(cited.flatMap(idsOf))];
}

export type CitationNumbers = Readonly<Record<string, number>>;

/** Número de cada fonte (1, 2, 3…) na ordem recebida. */
export function numberCitations(sourceIds: readonly string[]): CitationNumbers {
  return Object.fromEntries(sourceIds.map((id, index) => [id, index + 1]));
}
