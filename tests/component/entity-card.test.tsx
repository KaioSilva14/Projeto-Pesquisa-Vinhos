import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { EntityCard } from "@/components/entity/EntityCard";

import { exampleImage } from "../fixtures/images";

// Dados fictícios: só testam a exibição

describe("EntityCard", () => {
  it("nome é o link; mostra contexto e contagem de vinhos", () => {
    render(
      <EntityCard name="Uva Exemplo" href="/uvas/exemplo" context="Uva tinta" wineCount={1} />,
    );
    expect(screen.getByRole("link", { name: "Uva Exemplo" })).toHaveAttribute(
      "href",
      "/uvas/exemplo",
    );
    expect(screen.getByText("Uva tinta")).toBeInTheDocument();
    expect(screen.getByText("1 vinho")).toBeInTheDocument();
  });

  it("sem foto: aviso honesto e nenhum botão de créditos", () => {
    render(<EntityCard name="Uva Exemplo" href="/uvas/exemplo" wineCount={0} />);
    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Créditos/ })).not.toBeInTheDocument();
    expect(screen.getByText("Nenhum vinho no catálogo")).toBeInTheDocument();
  });

  it("com foto: o crédito completo abre no botão Créditos", async () => {
    render(<EntityCard name="Uva Exemplo" href="/uvas/exemplo" image={exampleImage} />);
    await userEvent.click(screen.getByRole("button", { name: /Créditos da foto/ }));
    expect(await screen.findByText(new RegExp(exampleImage.credit))).toBeInTheDocument();
  });
});
