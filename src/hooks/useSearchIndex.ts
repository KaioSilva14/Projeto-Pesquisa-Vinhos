import { useCallback, useState } from "react";

import { createSearcher, type Searcher } from "@/lib/search/search";
import type { SearchDocument } from "@/lib/search/types";

// O índice é baixado uma única vez por visita e compartilhado por todos os campos de busca
let cached: Promise<Searcher> | undefined;

async function fetchSearcher(): Promise<Searcher> {
  const response = await fetch("/api/search-index");
  if (!response.ok) throw new Error(`Índice de busca indisponível (HTTP ${response.status})`);
  const documents: unknown = await response.json();
  if (!Array.isArray(documents)) throw new Error("Índice de busca em formato inesperado");
  return createSearcher(documents as SearchDocument[]);
}

function loadSearcher(): Promise<Searcher> {
  cached ??= fetchSearcher().catch((error: unknown) => {
    cached = undefined; // permite tentar de novo no próximo foco
    throw error;
  });
  return cached;
}

/** Só para testes: esquece o índice já baixado. */
export function clearSearchIndexCache() {
  cached = undefined;
}

export type SearchIndexStatus = "idle" | "loading" | "ready" | "error";

/** Carrega o índice sob demanda (ADR-008): chame `load` no primeiro foco da busca. */
export function useSearchIndex() {
  const [state, setState] = useState<{ status: SearchIndexStatus; searcher?: Searcher }>({
    status: "idle",
  });

  const load = useCallback(() => {
    if (state.status === "loading" || state.status === "ready") return;
    setState({ status: "loading" });
    loadSearcher().then(
      (searcher) => setState({ status: "ready", searcher }),
      () => setState({ status: "error" }),
    );
  }, [state.status]);

  return { ...state, load };
}
