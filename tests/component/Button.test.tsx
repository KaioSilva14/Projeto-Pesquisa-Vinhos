import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { XIcon } from "@/components/ui/icons";

describe("Button", () => {
  it("é um botão do tipo 'button' por padrão (não envia formulários sem querer)", () => {
    render(<Button>Pesquisar</Button>);
    expect(screen.getByRole("button", { name: "Pesquisar" })).toHaveAttribute("type", "button");
  });

  it("chama onClick quando clicado", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ver vinhos</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Ver vinhos" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("não reage a cliques quando desabilitado", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Limpar filtros
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("em carregamento: mantém o nome, marca aria-busy e bloqueia cliques", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Pesquisar
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Pesquisar" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("aceita classes extras que sobrescrevem as da variante", () => {
    render(<Button className="px-8">Pesquisar</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-8");
    expect(button).not.toHaveClass("px-5");
  });
});

describe("IconButton", () => {
  it("usa o aria-label como nome acessível", () => {
    render(
      <IconButton aria-label="Fechar">
        <XIcon aria-hidden />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("repassa aria-pressed para botões de alternar", () => {
    render(
      <IconButton aria-label="Salvar nos favoritos" aria-pressed={true}>
        <XIcon aria-hidden />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Salvar nos favoritos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
