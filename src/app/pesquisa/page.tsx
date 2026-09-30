import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchForm } from "@/components/search/SearchForm";
import { SearchResults } from "@/components/search/SearchResults";
import { parseSearchPageParams } from "@/lib/search/params";
import { catalogService } from "@/services";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Página dinâmica (lê a URL) e fora dos buscadores (SEO.md §2)
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = parseSearchPageParams(await searchParams);
  return {
    title: q ? `Pesquisa: ${q}` : "Pesquisa",
    robots: { index: false, follow: true },
    alternates: { canonical: "/pesquisa" },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = parseSearchPageParams(await searchParams);
  const results = params.q ? await catalogService.searchCatalog(params.q) : [];

  return (
    <>
      <PageHeader
        title="Pesquisa"
        description="Encontre vinhos, uvas, regiões, países e produtores. Acentos e pequenos erros de digitação não atrapalham."
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Pesquisa", href: "/pesquisa" },
        ]}
      >
        <SearchForm query={params.q} />
      </PageHeader>
      <Container className="pb-16">
        {params.q && <SearchResults {...params} results={results} />}
      </Container>
    </>
  );
}
