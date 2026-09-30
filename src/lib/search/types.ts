/** Tipos de entidade que aparecem na busca (agrupamento do autocomplete). */
export const searchKinds = ["wine", "grape", "region", "country", "producer"] as const;

export type SearchKind = (typeof searchKinds)[number];

/**
 * Um item do índice de busca: só o necessário para achar e exibir o resultado.
 * Os textos ficam como no catálogo; a normalização acontece dentro do buscador.
 */
export type SearchDocument = {
  /** Único no índice: `{kind}:{id da entidade}`. */
  id: string;
  kind: SearchKind;
  name: string;
  /** Contexto exibido abaixo do nome, ex.: "Château Palmer · Bordeaux, França". */
  subtitle?: string;
  /** Termos extras que também encontram o item: tipo, uvas, país e gentílico. */
  keywords?: string[];
  href: string;
};

export type SearchResult = {
  document: SearchDocument;
  /** 0 = combinação perfeita; quanto maior, menos parecido. */
  score: number;
};
