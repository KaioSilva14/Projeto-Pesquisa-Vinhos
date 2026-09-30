import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
import { describe, expect, it, vi } from "vitest";

import ErrorPage from "@/app/error";
import { DemoBadge } from "@/components/states/DemoBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { IncompleteDataNote } from "@/components/states/IncompleteDataNote";
import { NoResults } from "@/components/states/NoResults";

describe("EmptyState", () => {
  it("usa o nível de título pedido e mostra a ação", () => {
    render(
      <EmptyState
        headingLevel="h1"
        title="Nenhum favorito ainda"
        action={<Link href="/vinhos">Explorar vinhos</Link>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Nenhum favorito ainda" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Explorar vinhos" })).toBeInTheDocument();
  });
});

describe("NoResults", () => {
  it("anuncia o termo pesquisado para leitores de tela", () => {
    render(<NoResults query="sauvinhon" />);
    expect(screen.getByRole("status")).toHaveTextContent("Nenhum resultado para “sauvinhon”");
  });

  it("só mostra 'Limpar filtros' quando há para onde voltar", () => {
    const { rerender } = render(<NoResults />);
    expect(screen.queryByRole("link", { name: "Limpar filtros" })).not.toBeInTheDocument();

    rerender(<NoResults clearHref="/vinhos" />);
    expect(screen.getByRole("link", { name: "Limpar filtros" })).toHaveAttribute("href", "/vinhos");
  });
});

describe("ErrorState", () => {
  it("é anunciado como alerta, com mensagem padrão sem detalhes técnicos", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toHaveTextContent(/Não foi possível carregar/);
  });
});

describe("Página de erro (error.tsx)", () => {
  it("'Tentar novamente' chama o retry do Next", async () => {
    const retry = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={new Error("falha de teste")} retry={retry} />);

    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Ir para o início" })).toHaveAttribute("href", "/");
  });

  it("não mostra a mensagem técnica do erro ao visitante", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorPage error={new Error("SEGREDO interno")} retry={() => {}} />);
    expect(screen.queryByText(/SEGREDO/)).not.toBeInTheDocument();
  });
});

describe("Selos de honestidade", () => {
  it("DemoBadge identifica dados de demonstração", () => {
    render(<DemoBadge />);
    expect(screen.getByText("Dados de demonstração")).toBeInTheDocument();
  });

  it("IncompleteDataNote cita o assunto", () => {
    render(<IncompleteDataNote subject="esta região" />);
    expect(
      screen.getByText("Ainda estamos verificando mais informações sobre esta região."),
    ).toBeInTheDocument();
  });
});
