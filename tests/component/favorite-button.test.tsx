import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useFavorites } from "@/stores/favorites";

// Dados fictícios: só testam o botão (ACCESSIBILITY.md §3.5)

beforeEach(async () => {
  window.localStorage.clear();
  useFavorites.setState({ items: [] });
  await act(() => useFavorites.persist.rehydrate());
});

describe("FavoriteButton", () => {
  it("rótulo com o nome e aria-pressed que muda ao clicar", async () => {
    render(<FavoriteButton kind="wine" id="vinho-exemplo" name="Vinho Exemplo" />);
    const button = screen.getByRole("button", { name: "Salvar Vinho Exemplo nos favoritos" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(button);
    expect(
      screen.getByRole("button", { name: "Remover Vinho Exemplo dos favoritos" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Vinho Exemplo salvo nos favoritos");
  });

  it("clicar de novo remove e avisa", async () => {
    render(<FavoriteButton kind="grape" id="uva-exemplo" name="Uva Exemplo" />);
    await userEvent.click(screen.getByRole("button"));
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Uva Exemplo removido dos favoritos");
    expect(useFavorites.getState().items).toEqual([]);
  });

  it("dois botões da mesma entidade ficam em sincronia", async () => {
    render(
      <>
        <FavoriteButton kind="region" id="regiao-exemplo" name="Região Exemplo" />
        <FavoriteButton kind="region" id="regiao-exemplo" name="Região Exemplo" />
      </>,
    );
    const [first] = screen.getAllByRole("button");
    await userEvent.click(first!);
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("aria-pressed", "true");
    }
  });
});
