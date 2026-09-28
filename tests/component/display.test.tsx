import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Badge } from "@/components/ui/Badge";
import { Card, CardLink } from "@/components/ui/Card";
import { ActiveFilterChip, FilterChip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";

describe("FilterChip", () => {
  it("informa se está selecionado com aria-pressed", () => {
    const { rerender } = render(<FilterChip selected={false}>Tinto</FilterChip>);
    expect(screen.getByRole("button", { name: "Tinto" })).toHaveAttribute("aria-pressed", "false");

    rerender(<FilterChip selected>Tinto</FilterChip>);
    expect(screen.getByRole("button", { name: "Tinto" })).toHaveAttribute("aria-pressed", "true");
  });

  it("inclui a contagem no nome acessível", () => {
    render(
      <FilterChip selected={false} count={12}>
        Tinto
      </FilterChip>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName(/Tinto.*12/);
  });
});

describe("ActiveFilterChip", () => {
  it("diz o que será removido e chama onClick", async () => {
    const onClick = vi.fn();
    render(<ActiveFilterChip label="Tinto" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Remover filtro: Tinto" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("Card", () => {
  it("é um artigo com um link principal", () => {
    render(
      <Card aria-labelledby="t">
        <h3 id="t">
          <CardLink href="/uvas/exemplo">Uva Exemplo</CardLink>
        </h3>
      </Card>,
    );
    expect(screen.getByRole("article", { name: "Uva Exemplo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Uva Exemplo" })).toHaveAttribute(
      "href",
      "/uvas/exemplo",
    );
  });
});

describe("Badge e Skeleton", () => {
  it("Badge mostra o texto", () => {
    render(<Badge>Espumante</Badge>);
    expect(screen.getByText("Espumante")).toBeInTheDocument();
  });

  it("Skeleton fica escondido de leitores de tela", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});
