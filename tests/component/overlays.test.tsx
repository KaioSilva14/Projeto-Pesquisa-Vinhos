import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Tooltip } from "@/components/ui/Tooltip";

function ExampleDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir diálogo</Button>
      </DialogTrigger>
      <DialogContent title="Título do diálogo" description="Descrição do diálogo">
        <Button variant="secondary">Ação interna</Button>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("abre com nome e descrição acessíveis", async () => {
    render(<ExampleDialog />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir diálogo" }));

    const dialog = screen.getByRole("dialog", { name: "Título do diálogo" });
    expect(dialog).toHaveAccessibleDescription("Descrição do diálogo");
  });

  it("move o foco para dentro ao abrir", async () => {
    render(<ExampleDialog />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir diálogo" }));

    expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
  });

  it("Esc fecha e devolve o foco ao botão que abriu", async () => {
    render(<ExampleDialog />);
    const trigger = screen.getByRole("button", { name: "Abrir diálogo" });
    await userEvent.click(trigger);

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("o botão 'Fechar' fecha o diálogo", async () => {
    render(<ExampleDialog />);
    await userEvent.click(screen.getByRole("button", { name: "Abrir diálogo" }));

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});

describe("Sheet", () => {
  it("abre com título e mostra o rodapé fixo", async () => {
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Filtros</Button>
        </SheetTrigger>
        <SheetContent title="Filtrar vinhos" footer={<Button>Ver resultados</Button>}>
          conteúdo
        </SheetContent>
      </Sheet>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Filtros" }));

    expect(screen.getByRole("dialog", { name: "Filtrar vinhos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver resultados" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });
});

describe("Popover", () => {
  it("abre pelo teclado e fecha com Esc", async () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Mais informações</Button>
        </PopoverTrigger>
        <PopoverContent>Texto do popover</PopoverContent>
      </Popover>,
    );
    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Texto do popover")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Texto do popover")).not.toBeInTheDocument());
  });
});

describe("Tooltip", () => {
  it("aparece também no foco pelo teclado", async () => {
    render(
      <Tooltip content="Salvar nos favoritos">
        <Button>Salvar</Button>
      </Tooltip>,
    );
    await userEvent.tab();

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Salvar nos favoritos");
  });
});
