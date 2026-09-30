import type { Metadata } from "next";
import Link from "next/link";

import { ActiveFilters } from "@/components/filters/ActiveFilters";
import { SortSelect } from "@/components/filters/SortSelect";
import { WineFilters } from "@/components/filters/WineFilters";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { NoResults } from "@/components/states/NoResults";
import { buttonVariants } from "@/components/ui/Button";
import { WineGrid } from "@/components/wine/WineGrid";
import { keepKnownValues, parseWineListParams } from "@/lib/filters/params";
import {
  applyFilters,
  countSelected,
  DEFAULT_WINE_SORT,
  WINES_PAGE_SIZE,
  winesHref,
} from "@/lib/filters/wine-filters";
import { sortWines } from "@/lib/wines/list-item";
import { catalogService } from "@/services";

type WinesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const DESCRIPTION =
  "Vinhos com ficha técnica e fontes oficiais. Filtre por tipo, país, região, uva e produtor.";

// Só a lista sem filtros vai para os buscadores; versões filtradas apontam para ela (SEO.md §2)
export async function generateMetadata({ searchParams }: WinesPageProps): Promise<Metadata> {
  const state = parseWineListParams(await searchParams);
  const isVariant =
    countSelected(state.selection) > 0 ||
    state.sort !== DEFAULT_WINE_SORT ||
    state.limit > WINES_PAGE_SIZE;
  return {
    title: "Vinhos",
    description: DESCRIPTION,
    alternates: { canonical: "/vinhos" },
    ...(isVariant && { robots: { index: false, follow: true } }),
  };
}

const vinhos = (count: number) => (count === 1 ? "1 vinho" : `${count} vinhos`);

export default async function WinesPage({ searchParams }: WinesPageProps) {
  const { items, options } = await catalogService.getWineList();
  const state = parseWineListParams(await searchParams);
  const selection = keepKnownValues(state.selection, options);
  const filtered = sortWines(applyFilters(items, selection), state.sort);
  const visible = filtered.slice(0, state.limit);
  // O navegador só recebe o necessário para contar as opções (id + valores dos filtros)
  const records = items.map(({ id, facets }) => ({ id, facets }));

  return (
    <>
      <PageHeader
        title="Vinhos"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Vinhos", href: "/vinhos" },
        ]}
      />
      <Container className="grid gap-8 pb-16 lg:grid-cols-[15rem_1fr] lg:gap-12">
        <WineFilters
          // Recria os filtros quando a URL muda (voltar/avançar do navegador)
          key={winesHref({ selection, sort: state.sort })}
          records={records}
          options={options}
          selection={selection}
          sort={state.sort}
        />

        <div className="grid content-start gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p role="status" className="text-text-muted">
              {filtered.length === items.length
                ? vinhos(items.length)
                : `${vinhos(filtered.length)} de ${items.length}`}
            </p>
            <SortSelect selection={selection} sort={state.sort} />
          </div>
          <ActiveFilters options={options} selection={selection} sort={state.sort} />

          {filtered.length === 0 ? (
            <NoResults clearHref={winesHref({ sort: state.sort })} />
          ) : (
            <>
              <WineGrid wines={visible} label="Lista de vinhos" />
              {visible.length < filtered.length && (
                <div className="grid justify-items-center gap-3">
                  <p className="text-small text-text-muted">
                    Mostrando {visible.length} de {filtered.length}
                  </p>
                  <Link
                    href={winesHref({
                      selection,
                      sort: state.sort,
                      limit: state.limit + WINES_PAGE_SIZE,
                    })}
                    scroll={false}
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Carregar mais vinhos
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
}
