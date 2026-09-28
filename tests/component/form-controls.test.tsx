import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

const options = [
  { value: "a", label: "Opção A" },
  { value: "b", label: "Opção B" },
];

describe("Select", () => {
  it("liga o rótulo ao campo", () => {
    render(<Select label="Ordenar por" options={options} />);
    expect(screen.getByRole("combobox", { name: "Ordenar por" })).toBeInTheDocument();
  });

  it("escolhe uma opção pelo teclado", async () => {
    const onValueChange = vi.fn();
    render(<Select label="Ordenar por" options={options} onValueChange={onValueChange} />);

    screen.getByRole("combobox").focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.click(await screen.findByRole("option", { name: "Opção B" }));

    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("combobox")).toHaveTextContent("Opção B");
  });
});

describe("Checkbox", () => {
  it("clicar no rótulo marca e desmarca", async () => {
    render(<Checkbox label="Tinto" />);
    const checkbox = screen.getByRole("checkbox", { name: "Tinto" });
    expect(checkbox).not.toBeChecked();

    await userEvent.click(screen.getByText("Tinto"));
    expect(checkbox).toBeChecked();
  });

  it("marca pelo teclado com Espaço", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Branco" onCheckedChange={onCheckedChange} />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("inclui a contagem no nome acessível", () => {
    render(<Checkbox label="Rosé" count={3} />);
    expect(screen.getByRole("checkbox")).toHaveAccessibleName(/Rosé.*3/);
  });
});

describe("Accordion", () => {
  it("abre e fecha a seção, informando o estado", async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item">
          <AccordionTrigger>Pergunta</AccordionTrigger>
          <AccordionContent>Resposta</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: "Pergunta" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Resposta")).toBeVisible();
  });

  it("o gatilho fica dentro de um título (hierarquia da página)", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item">
          <AccordionTrigger>Pergunta</AccordionTrigger>
          <AccordionContent>Resposta</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Pergunta" })).toBeInTheDocument();
  });
});

describe("Tabs", () => {
  it("setas do teclado trocam de aba", async () => {
    render(
      <Tabs defaultValue="um">
        <TabsList aria-label="Seções">
          <TabsTrigger value="um">Primeira</TabsTrigger>
          <TabsTrigger value="dois">Segunda</TabsTrigger>
        </TabsList>
        <TabsContent value="um">Conteúdo 1</TabsContent>
        <TabsContent value="dois">Conteúdo 2</TabsContent>
      </Tabs>,
    );
    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Primeira" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Segunda" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Conteúdo 2");
  });
});
