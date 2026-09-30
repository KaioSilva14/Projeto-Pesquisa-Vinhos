import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SearchCombobox } from "@/components/search/SearchCombobox";
import { SearchShortcuts } from "@/components/search/SearchShortcuts";
import { clearSearchIndexCache } from "@/hooks/useSearchIndex";
import type { SearchDocument } from "@/lib/search/types";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

// Documentos fictícios: só testam o comportamento do componente
const documents: SearchDocument[] = [
  { id: "grape:exemplo", kind: "grape", name: "Uva Exemplo", href: "/uvas/exemplo" },
  {
    id: "wine:exemplo",
    kind: "wine",
    name: "Vinho Exemplo",
    subtitle: "Produtor Exemplo",
    keywords: ["Uva Exemplo"],
    href: "/vinhos/exemplo",
  },
];

function mockIndex(response: Response | Promise<Response>) {
  const fetchMock = vi.fn(() => Promise.resolve(response));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderCombobox() {
  render(
    <form action="/pesquisa">
      <SearchCombobox label="Pesquisar no Vinum" />
    </form>,
  );
  return screen.getByRole("combobox", { name: "Pesquisar no Vinum" });
}

beforeEach(() => {
  clearSearchIndexCache();
  push.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SearchCombobox", () => {
  it("só baixa o índice quando o campo recebe foco", async () => {
    const fetchMock = mockIndex(Response.json(documents));
    const input = renderCombobox();
    expect(fetchMock).not.toHaveBeenCalled();

    await userEvent.click(input);
    expect(fetchMock).toHaveBeenCalledWith("/api/search-index");
  });

  it("sugere resultados agrupados por tipo, mesmo com erro de digitação", async () => {
    mockIndex(Response.json(documents));
    await userEvent.type(renderCombobox(), "exenplo");

    const listbox = await screen.findByRole("listbox", { name: "Sugestões" });
    expect(screen.getByRole("group", { name: "Vinhos" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Uvas" })).toBeInTheDocument();
    expect(listbox).toHaveTextContent("Ver todos os resultados para “exenplo”");
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("status")).toHaveTextContent("2 sugestões disponíveis");
  });

  it("navega pelas opções com as setas e abre com Enter", async () => {
    mockIndex(Response.json(documents));
    const input = renderCombobox();
    await userEvent.type(input, "produtor exemplo");
    await screen.findByRole("listbox");

    await userEvent.keyboard("{ArrowDown}");
    const active = screen.getByRole("option", { selected: true });
    expect(input).toHaveAttribute("aria-activedescendant", active.id);

    await userEvent.keyboard("{Enter}");
    expect(push).toHaveBeenCalledWith("/vinhos/exemplo");
  });

  it("seta para cima a partir do campo vai para a última opção (ver todos)", async () => {
    mockIndex(Response.json(documents));
    const input = renderCombobox();
    await userEvent.type(input, "vinho");
    await screen.findByRole("listbox");

    await userEvent.keyboard("{ArrowUp}{Enter}");
    expect(push).toHaveBeenCalledWith("/pesquisa?q=vinho");
  });

  it("abre a opção clicada", async () => {
    mockIndex(Response.json(documents));
    await userEvent.type(renderCombobox(), "uva exemplo");
    await userEvent.click(await screen.findByRole("option", { name: /Uva Exemplo/ }));
    expect(push).toHaveBeenCalledWith("/uvas/exemplo");
  });

  it("Esc fecha as sugestões e, na segunda vez, limpa o campo", async () => {
    mockIndex(Response.json(documents));
    const input = renderCombobox();
    await userEvent.type(input, "exemplo");
    await screen.findByRole("listbox");

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(input).toHaveValue("exemplo");

    await userEvent.keyboard("{Escape}");
    expect(input).toHaveValue("");
  });

  it("avisa quando não há sugestões", async () => {
    mockIndex(Response.json(documents));
    await userEvent.type(renderCombobox(), "xylofone");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Nenhuma sugestão para “xylofone”"),
    );
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("se o índice falhar, avisa e o Enter continua enviando o formulário", async () => {
    mockIndex(new Response("erro", { status: 500 }));
    const input = renderCombobox();
    await userEvent.type(input, "exemplo");
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Sugestões indisponíveis"),
    );
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(push).not.toHaveBeenCalled();
  });
});

describe("SearchShortcuts", () => {
  function renderWithShortcuts() {
    render(
      <>
        <SearchShortcuts />
        <label>
          Outro campo
          <input />
        </label>
        <SearchCombobox label="Pesquisar no Vinum" />
      </>,
    );
  }

  // O jsdom não calcula layout: simula que o campo está visível na tela
  function stubVisible(visible: boolean) {
    vi.spyOn(Element.prototype, "getClientRects").mockReturnValue(
      (visible ? [new DOMRect()] : []) as unknown as DOMRectList,
    );
  }

  afterEach(() => vi.restoreAllMocks());

  it("/ e Ctrl+K focam a busca", async () => {
    mockIndex(Response.json(documents));
    stubVisible(true);
    renderWithShortcuts();

    await userEvent.keyboard("/");
    expect(screen.getByRole("combobox")).toHaveFocus();

    screen.getByRole("combobox").blur();
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("sem campo de busca visível (celular), abre a página de pesquisa", async () => {
    stubVisible(false);
    renderWithShortcuts();
    await userEvent.keyboard("/");
    expect(push).toHaveBeenCalledWith("/pesquisa");
  });

  it("/ é só uma barra enquanto a pessoa digita em outro campo", async () => {
    renderWithShortcuts();
    const other = screen.getByRole("textbox", { name: "Outro campo" });
    await userEvent.type(other, "a/b");
    expect(other).toHaveValue("a/b");
    expect(other).toHaveFocus();
  });
});
