import { NoResults } from "@/components/states/NoResults";
import { FilterChipLink } from "@/components/ui/Chip";
import { Pagination } from "@/components/ui/Pagination";
import { SEARCH_KIND_LABELS } from "@/lib/labels";
import { SEARCH_PAGE_SIZE, searchHref, type SearchPageParams } from "@/lib/search/params";
import { searchKinds, type SearchResult } from "@/lib/search/types";

import { CompactResult } from "./CompactResult";

type SearchResultsProps = SearchPageParams & {
  /** Todos os resultados da busca, antes do filtro por tipo. */
  results: readonly SearchResult[];
};

const plural = (count: number) => (count === 1 ? "1 resultado" : `${count} resultados`);

/** Resultados de /pesquisa: resumo, filtro por tipo, lista e paginação. */
export function SearchResults({ q, kind, page, results }: SearchResultsProps) {
  if (results.length === 0) return <NoResults query={q} />;

  const filtered = kind ? results.filter((result) => result.document.kind === kind) : results;
  if (filtered.length === 0) {
    return <NoResults query={q} clearHref={searchHref({ q })} clearLabel="Ver todos os tipos" />;
  }

  const totalPages = Math.ceil(filtered.length / SEARCH_PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * SEARCH_PAGE_SIZE,
    currentPage * SEARCH_PAGE_SIZE,
  );
  // Só tipos que têm resultados viram opção de filtro (sem opções vazias)
  const kindCounts = searchKinds
    .map((item) => ({
      kind: item,
      count: results.filter((result) => result.document.kind === item).length,
    }))
    .filter((item) => item.count > 0);

  return (
    <div className="grid gap-6">
      <p role="status" className="text-text-muted">
        {plural(filtered.length)} para “{q}”
        {kind && ` em ${SEARCH_KIND_LABELS[kind].many.toLowerCase()}`}
      </p>

      {kindCounts.length > 1 && (
        <nav aria-label="Filtrar por tipo">
          <ul className="flex flex-wrap gap-2">
            <li>
              <FilterChipLink href={searchHref({ q })} selected={!kind} count={results.length}>
                Todos
              </FilterChipLink>
            </li>
            {kindCounts.map((item) => (
              <li key={item.kind}>
                <FilterChipLink
                  href={searchHref({ q, kind: item.kind })}
                  selected={kind === item.kind}
                  count={item.count}
                >
                  {SEARCH_KIND_LABELS[item.kind].many}
                </FilterChipLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ol aria-label="Resultados da pesquisa" className="grid divide-y divide-border">
        {pageItems.map((result) => (
          <li key={result.document.id}>
            <CompactResult document={result.document} />
          </li>
        ))}
      </ol>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        hrefFor={(target) => searchHref({ q, kind, page: target })}
      />
    </div>
  );
}
