import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompactResult } from "@/components/search/CompactResult";
import { SearchResults } from "@/components/search/SearchResults";
import { SEARCH_PAGE_SIZE } from "@/lib/search/params";
import type { SearchDocument, SearchKind, SearchResult } from "@/lib/search/types";

// Documentos fictícios: só testam a exibição
function result(index: number, kind: SearchKind = "wine"): SearchResult {
  return {
    document: {
      id: `${kind}:exemplo-${index}`,
      kind,
      name: `Exemplo ${index}`,
      subtitle: `Contexto ${index}`,
      href: `/x/exemplo-${index}`,
    },
    score: index / 100,
  };
}

const many = (count: number, kind?: SearchKind) =>
  Array.from({ length: count }, (_, index) => result(index + 1, kind));

describe("CompactResult", () => {
  it("é um link com nome, contexto e tipo", () => {
    render(<CompactResult document={result(1, "grape").document} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/x/exemplo-1");
    expect(link).toHaveTextContent("Exemplo 1");
    expect(link).toHaveTextContent("Contexto 1");
    expect(link).toHaveTextContent("Uva");
  });

  it("não mostra subtítulo quando o documento não tem", () => {
    const { subtitle, ...document }: SearchDocument = result(1).document;
    render(<CompactResult document={document} />);
    expect(screen.queryByText(subtitle!)).not.toBeInTheDocument();
  });
});

describe("SearchResults", () => {
  it("anuncia quantos resultados há", () => {
    render(<SearchResults q="exemplo" page={1} results={many(1)} />);
    expect(screen.getByRole("status")).toHaveTextContent("1 resultado para “exemplo”");
  });

  it("mostra NoResults quando nada foi encontrado", () => {
    render(<SearchResults q="nada" page={1} results={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("Nenhum resultado para “nada”");
  });

  it("oferece filtro só para tipos que têm resultados", () => {
    render(<SearchResults q="exemplo" page={1} results={[...many(2), result(9, "grape")]} />);
    const filter = within(screen.getByRole("navigation", { name: "Filtrar por tipo" }));
    expect(filter.getByRole("link", { name: /Todos/ })).toHaveAttribute("aria-current", "page");
    expect(filter.getByRole("link", { name: /Vinhos/ })).toHaveAttribute(
      "href",
      "/pesquisa?q=exemplo&tipo=vinhos",
    );
    expect(filter.getByRole("link", { name: /Uvas/ })).toBeInTheDocument();
    expect(filter.queryByRole("link", { name: /Regiões/ })).not.toBeInTheDocument();
  });

  it("sem filtro quando todos os resultados são do mesmo tipo", () => {
    render(<SearchResults q="exemplo" page={1} results={many(3)} />);
    expect(screen.queryByRole("navigation", { name: "Filtrar por tipo" })).not.toBeInTheDocument();
  });

  it("filtra pelo tipo escolhido", () => {
    render(
      <SearchResults
        q="exemplo"
        kind="grape"
        page={1}
        results={[...many(2), result(9, "grape")]}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("1 resultado para “exemplo” em uvas");
    expect(screen.getAllByRole("listitem").filter((item) => item.closest("ol"))).toHaveLength(1);
  });

  it("tipo escolhido sem resultados oferece voltar a todos os tipos", () => {
    render(<SearchResults q="exemplo" kind="country" page={1} results={many(2)} />);
    expect(screen.getByRole("link", { name: "Ver todos os tipos" })).toHaveAttribute(
      "href",
      "/pesquisa?q=exemplo",
    );
  });

  it("pagina os resultados e leva o estado nos links", () => {
    render(<SearchResults q="exemplo" page={2} results={many(SEARCH_PAGE_SIZE + 5)} />);
    const list = screen.getByRole("list", { name: "Resultados da pesquisa" });
    expect(within(list).getAllByRole("link")).toHaveLength(5);
    const pagination = within(screen.getByRole("navigation", { name: "Paginação" }));
    expect(pagination.getByText("Página 2 de 2")).toBeInTheDocument();
    expect(pagination.getByRole("link", { name: /Anterior/ })).toHaveAttribute(
      "href",
      "/pesquisa?q=exemplo",
    );
    expect(pagination.queryByRole("link", { name: /Próxima/ })).not.toBeInTheDocument();
  });

  it("página além da última mostra a última", () => {
    render(<SearchResults q="exemplo" page={99} results={many(3)} />);
    expect(screen.getAllByRole("link", { name: /Exemplo/ })).toHaveLength(3);
  });
});
