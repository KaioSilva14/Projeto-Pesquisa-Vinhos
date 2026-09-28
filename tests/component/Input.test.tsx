import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";

describe("Input", () => {
  it("liga o rótulo ao campo", () => {
    render(<Input label="Nome do produtor" />);
    expect(screen.getByRole("textbox", { name: "Nome do produtor" })).toBeInTheDocument();
  });

  it("descreve o campo com a dica e o erro", () => {
    render(<Input label="Safra" hint="Ano com quatro dígitos" error="Informe um ano válido" />);
    const input = screen.getByRole("textbox", { name: "Safra" });
    expect(input).toHaveAccessibleDescription("Ano com quatro dígitos Informe um ano válido");
    expect(input).toBeInvalid();
  });

  it("não marca inválido nem aponta descrições inexistentes sem erro ou dica", () => {
    render(<Input label="Safra" />);
    const input = screen.getByRole("textbox", { name: "Safra" });
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("mantém o rótulo para leitores de tela quando escondido", () => {
    render(<Input label="Pesquisar" hideLabel />);
    expect(screen.getByRole("textbox", { name: "Pesquisar" })).toBeInTheDocument();
  });
});

describe("SearchInput", () => {
  it("tem nome acessível mesmo sem rótulo visível", () => {
    render(<SearchInput label="Pesquisar vinhos" />);
    expect(screen.getByRole("searchbox", { name: "Pesquisar vinhos" })).toBeInTheDocument();
  });

  it("só mostra o botão de limpar quando há texto", async () => {
    render(<SearchInput label="Pesquisar vinhos" />);
    expect(screen.queryByRole("button", { name: "Limpar pesquisa" })).not.toBeInTheDocument();

    await userEvent.type(screen.getByRole("searchbox"), "malbec");
    expect(screen.getByRole("button", { name: "Limpar pesquisa" })).toBeInTheDocument();
  });

  it("limpar apaga o texto, avisa a mudança e devolve o foco ao campo", async () => {
    const onValueChange = vi.fn();
    render(
      <SearchInput label="Pesquisar vinhos" defaultValue="malbec" onValueChange={onValueChange} />,
    );
    const input = screen.getByRole("searchbox");

    await userEvent.click(screen.getByRole("button", { name: "Limpar pesquisa" }));

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("");
  });

  it("expõe o atalho de teclado para tecnologias assistivas", () => {
    render(<SearchInput label="Pesquisar vinhos" shortcutHint="/" />);
    expect(screen.getByRole("searchbox")).toHaveAttribute("aria-keyshortcuts", "/");
  });
});
