import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ActiveFilters } from "@/components/filters/ActiveFilters";
import { FilterGroups } from "@/components/filters/FilterGroups";
import { WineFilters } from "@/components/filters/WineFilters";
import { WineCard } from "@/components/wine/WineCard";
import type { FacetRecord, FilterOptions } from "@/lib/filters/wine-filters";
import type { WineListItem } from "@/lib/wines/list-item";

import { exampleImage } from "../fixtures/images";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeEach(() => push.mockReset());

// Dados fictícios: só testam a exibição
const options: FilterOptions = {
  tipo: [
    { value: "tinto", label: "Tinto" },
    { value: "branco", label: "Branco" },
  ],
  pais: [
    { value: "pais-a", label: "País A" },
    { value: "pais-b", label: "País B" },
  ],
  regiao: [],
  uva: [],
  produtor: [],
};
const record = (id: string, tipo: string, pais: string): FacetRecord => ({
  id,
  facets: { tipo: [tipo], pais: [pais], regiao: [], uva: [], produtor: [] },
});
const records = [
  record("1", "tinto", "pais-a"),
  record("2", "tinto", "pais-b"),
  record("3", "branco", "pais-a"),
];

describe("WineCard", () => {
  const wine: WineListItem = {
    ...record("exemplo", "tinto", "pais-a"),
    name: "Vinho Exemplo",
    href: "/vinhos/exemplo",
    producerName: "Produtor Exemplo",
    place: "Região Exemplo, País A",
    typeLabel: "Tinto",
    latestYear: 2020,
    isNonVintage: false,
  };

  it("mostra nome como link, produtor, lugar, tipo e safra", () => {
    render(<WineCard wine={wine} />);
    expect(screen.getByRole("heading", { level: 2, name: "Vinho Exemplo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vinho Exemplo" })).toHaveAttribute(
      "href",
      "/vinhos/exemplo",
    );
    expect(screen.getByText("Produtor Exemplo")).toBeInTheDocument();
    expect(screen.getByText("Região Exemplo, País A")).toBeInTheDocument();
    expect(screen.getByText("Safra 2020")).toBeInTheDocument();
  });

  it("com foto: mostra a garrafa e o botão de créditos", () => {
    render(<WineCard wine={{ ...wine, image: exampleImage }} />);
    expect(screen.getByRole("img", { name: exampleImage.alt })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Créditos da foto/ })).toBeInTheDocument();
  });

  it("sem foto, só reserva a área (aviso honesto) quando a grade pede", () => {
    const { rerender } = render(<WineCard wine={wine} />);
    expect(screen.queryByText("Imagem indisponível")).not.toBeInTheDocument();
    rerender(<WineCard wine={wine} reserveImage />);
    expect(screen.getByText("Imagem indisponível")).toBeInTheDocument();
  });

  it("multissafra no lugar da safra; campos ausentes não aparecem", () => {
    const { producerName, place, latestYear, ...partial } = wine;
    render(<WineCard wine={{ ...partial, isNonVintage: true }} />);
    expect(screen.getByText("Multissafra")).toBeInTheDocument();
    expect(screen.queryByText(/Safra/)).not.toBeInTheDocument();
    expect(screen.queryByText(producerName!)).not.toBeInTheDocument();
  });
});

describe("FilterGroups", () => {
  it("agrupa em fieldset com legenda e mostra a contagem", () => {
    render(<FilterGroups records={records} options={options} selection={{}} onToggle={vi.fn()} />);
    const tipo = screen.getByRole("group", { name: "Tipo" });
    expect(within(tipo).getByRole("checkbox", { name: /Tinto/ })).toBeInTheDocument();
    expect(within(tipo).getByText("Tinto").parentElement).toHaveTextContent("2");
  });

  it("esconde opções sem vinho e grupos vazios", () => {
    render(
      <FilterGroups
        records={records}
        options={options}
        selection={{ tipo: ["branco"] }}
        onToggle={vi.fn()}
      />,
    );
    const pais = screen.getByRole("group", { name: "País" });
    expect(within(pais).queryByRole("checkbox", { name: /País B/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Região" })).not.toBeInTheDocument();
  });

  it("avisa qual opção foi marcada", async () => {
    const onToggle = vi.fn();
    render(<FilterGroups records={records} options={options} selection={{}} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("checkbox", { name: /País B/ }));
    expect(onToggle).toHaveBeenCalledWith("pais", "pais-b");
  });
});

describe("ActiveFilters", () => {
  it("cada filtro aplicado é um link que o remove, e há Limpar tudo", () => {
    render(
      <ActiveFilters
        options={options}
        selection={{ tipo: ["tinto"], pais: ["pais-a"] }}
        sort="nome"
      />,
    );
    expect(screen.getByRole("link", { name: "Remover filtro: País A" })).toHaveAttribute(
      "href",
      "/vinhos?tipo=tinto",
    );
    expect(screen.getByRole("link", { name: "Limpar tudo" })).toHaveAttribute("href", "/vinhos");
  });

  it("não aparece sem filtros", () => {
    const { container } = render(<ActiveFilters options={options} selection={{}} sort="nome" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("WineFilters", () => {
  it("no desktop, marcar um filtro muda a URL na hora", async () => {
    render(<WineFilters records={records} options={options} selection={{}} sort="safra" />);
    const [desktopTinto] = screen.getAllByRole("checkbox", { name: /Tinto/ });
    await userEvent.click(desktopTinto!);
    expect(push).toHaveBeenCalledWith("/vinhos?tipo=tinto&ordem=safra", { scroll: false });
  });

  it("no celular, as escolhas só valem ao tocar em Ver N vinhos", async () => {
    render(
      <WineFilters
        records={records}
        options={options}
        selection={{ tipo: ["tinto"] }}
        sort="nome"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Filtros (1)" }));
    const sheet = screen.getByRole("dialog", { name: "Filtros" });

    await userEvent.click(within(sheet).getByRole("checkbox", { name: /País B/ }));
    expect(push).not.toHaveBeenCalled();
    await userEvent.click(within(sheet).getByRole("button", { name: "Ver 1 vinho" }));
    expect(push).toHaveBeenCalledWith("/vinhos?tipo=tinto&pais=pais-b", { scroll: false });
  });

  it("Limpar desmarca tudo no painel do celular", async () => {
    render(
      <WineFilters
        records={records}
        options={options}
        selection={{ tipo: ["tinto"] }}
        sort="nome"
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Filtros (1)" }));
    const sheet = screen.getByRole("dialog", { name: "Filtros" });
    await userEvent.click(within(sheet).getByRole("button", { name: "Limpar" }));
    expect(within(sheet).getByRole("button", { name: "Ver 3 vinhos" })).toBeInTheDocument();
  });
});
