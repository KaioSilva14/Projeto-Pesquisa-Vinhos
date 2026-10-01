import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CorrectionForm } from "@/components/corrections/CorrectionForm";

// Dados fictícios (ADR-031): o formulário só abre uma issue no GitHub
const push = vi.fn();
let search = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => search,
}));

const REPO = "https://github.com/exemplo/repo";
const problem = "O texto diz safra 2019, mas a ficha técnica diz 2020.";

beforeEach(() => {
  push.mockClear();
  search = new URLSearchParams();
});

describe("CorrectionForm", () => {
  it("vem com a página preenchida quando chega de uma página do site", () => {
    search = new URLSearchParams({ pagina: "/vinhos/vinho-exemplo-01" });
    render(<CorrectionForm repositoryUrl={REPO} />);
    expect(screen.getByLabelText("Página com o erro")).toHaveValue("/vinhos/vinho-exemplo-01");
  });

  it("ignora um endereço externo vindo da URL", () => {
    search = new URLSearchParams({ pagina: "https://outro.site" });
    render(<CorrectionForm repositoryUrl={REPO} />);
    expect(screen.getByLabelText("Página com o erro")).toHaveValue("");
  });

  it("enviar vazio mostra um resumo dos erros e marca os campos", async () => {
    render(<CorrectionForm repositoryUrl={REPO} />);
    await userEvent.click(screen.getByRole("button", { name: "Continuar no GitHub" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Faltam corrigir 2 campos");
    expect(screen.getByLabelText("Página com o erro")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("O que está errado?")).toHaveAccessibleDescription(
      /pelo menos 20 caracteres/,
    );
  });

  it("conta os caracteres e não aceita além do limite", async () => {
    render(<CorrectionForm repositoryUrl={REPO} />);
    const field = screen.getByLabelText("O que está errado?");
    expect(field).toHaveAttribute("maxLength", "1000");
    await userEvent.type(field, "Erro de safra");
    expect(screen.getByText("13 de 1000 caracteres")).toBeInTheDocument();
  });

  it("válido: abre o GitHub numa nova aba e leva ao agradecimento", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue({ opener: {} } as Window);
    render(<CorrectionForm repositoryUrl={REPO} />);
    await userEvent.type(screen.getByLabelText("Página com o erro"), "/uvas/uva-exemplo");
    await userEvent.type(screen.getByLabelText("O que está errado?"), problem);
    await userEvent.click(screen.getByRole("button", { name: "Continuar no GitHub" }));
    expect(open).toHaveBeenCalledWith(expect.stringContaining(`${REPO}/issues/new`), "_blank");
    expect(push).toHaveBeenCalledWith("/sugerir-correcao/obrigado");
    open.mockRestore();
  });

  it("nova aba bloqueada: oferece o link em vez de falhar em silêncio", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<CorrectionForm repositoryUrl={REPO} />);
    await userEvent.type(screen.getByLabelText("Página com o erro"), "/uvas/uva-exemplo");
    await userEvent.type(screen.getByLabelText("O que está errado?"), problem);
    await userEvent.click(screen.getByRole("button", { name: "Continuar no GitHub" }));
    expect(screen.getByRole("alert")).toHaveTextContent("O navegador bloqueou a nova aba");
    expect(screen.getByRole("link", { name: "continuar no GitHub" })).toHaveAttribute(
      "href",
      expect.stringContaining(`${REPO}/issues/new`),
    );
    expect(push).not.toHaveBeenCalled();
    open.mockRestore();
  });
});
