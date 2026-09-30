import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "@/components/seo/JsonLd";
import { Cite } from "@/components/sources/Cite";
import { SourceList } from "@/components/sources/SourceList";
import { FactList } from "@/components/wine/FactList";
import { GrapeComposition } from "@/components/wine/GrapeComposition";
import { SensoryProfile } from "@/components/wine/SensoryProfile";
import { WineHeader } from "@/components/wine/WineHeader";
import type { WinePageData } from "@/lib/wines/page-data";

import { exampleSource, exampleWine } from "../fixtures/entities";

// Dados fictícios: só testam a exibição
const numbers = { "src-teste-01": 1, "src-teste-02": 2 };
const src = { sourceIds: ["src-teste-01"] as [string] };

describe("Cite", () => {
  it("mostra o número da fonte com link para a lista", () => {
    render(<Cite ids={["src-teste-02", "src-teste-01"]} numbers={numbers} />);
    expect(screen.getByRole("link", { name: "Fonte 1" })).toHaveAttribute("href", "#fonte-1");
    expect(screen.getByRole("link", { name: "Fonte 2" })).toHaveAttribute("href", "#fonte-2");
  });

  it("some sem fonte conhecida", () => {
    const { container } = render(<Cite ids={["src-desconhecida"]} numbers={numbers} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("SourceList", () => {
  it("numera as fontes, liga para a origem e mostra a data de consulta", () => {
    render(<SourceList sources={[{ ...exampleSource, url: "https://example.org/ficha" }]} />);
    const item = screen.getByRole("listitem");
    expect(item).toHaveAttribute("id", "fonte-1");
    expect(within(item).getByRole("link")).toHaveAttribute("rel", "noopener noreferrer");
    expect(item).toHaveTextContent(/consultada em \d+ de \w+ de \d{4}/);
  });
});

describe("FactList", () => {
  it("campos ausentes não aparecem; os presentes levam a fonte", () => {
    render(
      <FactList
        numbers={numbers}
        facts={[false, undefined, { label: "Tipo", value: "Tinto", sourceIds: ["src-teste-01"] }]}
      />,
    );
    expect(screen.getAllByRole("term")).toHaveLength(1);
    expect(screen.getByRole("definition")).toHaveTextContent("Tinto1");
  });

  it("sem nenhum campo, não renderiza nada", () => {
    const { container } = render(<FactList numbers={numbers} facts={[false]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("GrapeComposition", () => {
  const grapes = {
    "uva-a": { name: "Uva A", slug: "uva-a" },
    "uva-b": { name: "Uva B", slug: "uva-b" },
  };

  it("percentual só quando informado; nota explica o que falta", () => {
    render(
      <GrapeComposition
        grapes={grapes}
        composition={{
          value: [{ grapeId: "uva-a", percentage: 90 }, { grapeId: "uva-b" }],
          ...src,
          notes: "Os outros 10% são de uma uva fora do catálogo.",
        }}
      />,
    );
    expect(screen.getByRole("link", { name: "Uva A" })).toHaveAttribute("href", "/uvas/uva-a");
    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Uva B" }).parentElement).not.toHaveTextContent("%");
    expect(screen.getByText(/fora do catálogo/)).toBeInTheDocument();
  });
});

describe("SensoryProfile", () => {
  it("mostra só atributos com fonte, com o termo exato e o nível em texto", () => {
    render(
      <SensoryProfile
        numbers={numbers}
        profile={{ body: { level: 4, sourceTerm: "médio a encorpado", ...src } }}
      />,
    );
    expect(screen.getByRole("term")).toHaveTextContent("Corpo");
    expect(screen.getByRole("definition")).toHaveTextContent("médio a encorpado (4 de 5)");
    expect(screen.queryByText("Acidez")).not.toBeInTheDocument();
  });

  it("sem atributos, não renderiza nada", () => {
    const { container } = render(<SensoryProfile numbers={numbers} profile={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("WineHeader", () => {
  const data: WinePageData = {
    wine: exampleWine,
    grapes: {},
    vintages: [],
    sources: [],
    related: [],
  };

  it("vinho com poucos dados verificados mostra o aviso honesto", () => {
    render(<WineHeader data={data} numbers={numbers} />);
    expect(screen.getByRole("heading", { level: 1, name: "Vinho Exemplo 01" })).toBeInTheDocument();
    expect(screen.getByText(/Ainda estamos verificando/)).toBeInTheDocument();
  });

  it("dados de demonstração sempre com o selo", () => {
    render(
      <WineHeader data={{ ...data, wine: { ...exampleWine, isDemo: true } }} numbers={numbers} />,
    );
    expect(screen.getByText("Dados de demonstração")).toBeInTheDocument();
  });
});

describe("JsonLd", () => {
  it("escapa o sinal de menor para não fechar a tag script", () => {
    const { container } = render(<JsonLd data={{ name: "</script><script>alert(1)</script>" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).not.toContain("</script>");
    expect(JSON.parse(script?.innerHTML ?? "{}")).toEqual({
      name: "</script><script>alert(1)</script>",
    });
  });
});
