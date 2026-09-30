import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EntityGrid } from "@/components/entity/EntityGrid";
import { LinkList } from "@/components/entity/LinkList";
import { RegionFacts } from "@/components/place/RegionFacts";
import type { EntityListItem } from "@/lib/entity-list";
import { ofCountry } from "@/lib/places/grammar";
import type { RegionPageData } from "@/lib/places/page-data";

import { base } from "../fixtures/entities";
import { exampleImage } from "../fixtures/images";

// Dados fictícios: só testam a exibição
const item = (id: string, withImage = false): EntityListItem => ({
  id,
  name: `Região ${id}`,
  href: `/regioes/${id}`,
  wineCount: 0,
  ...(withImage && { image: exampleImage }),
});

describe("EntityGrid", () => {
  it("nenhum card com foto: nenhum reserva área de imagem", () => {
    render(<EntityGrid items={[item("a"), item("b")]} label="Lista" imageVariant="landscape" />);
    expect(screen.queryByText("Imagem indisponível")).not.toBeInTheDocument();
  });

  it("algum card com foto: os outros mostram o aviso honesto", () => {
    render(
      <EntityGrid items={[item("a", true), item("b")]} label="Lista" imageVariant="landscape" />,
    );
    expect(screen.getAllByText("Imagem indisponível")).toHaveLength(1);
  });
});

describe("LinkList", () => {
  it("links em texto corrido, separados por vírgula", () => {
    const { container } = render(
      <p>
        <LinkList
          items={[
            { name: "A", href: "/a" },
            { name: "B", href: "/b" },
          ]}
        />
      </p>,
    );
    expect(container).toHaveTextContent("A, B");
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});

describe("RegionFacts", () => {
  const src = { sourceIds: ["src-teste-01"] as [string] };
  const data: RegionPageData = {
    region: {
      ...base,
      id: "regiao-exemplo",
      slug: "regiao-exemplo",
      name: "Região Exemplo",
      countryId: "xx",
      level: "appellation",
      appellation: { value: { system: "Sistema Exemplo", category: "DOX" }, ...src },
      mainGrapeIds: { value: ["uva-a"], ...src, notes: "Nota da fonte sobre a uva." },
    },
    children: [],
    grapes: [{ name: "Uva A", href: "/uvas/uva-a" }],
    producers: [],
    wines: [],
    sources: [],
  };

  it("mostra a denominação e as uvas principais com a nota da fonte", () => {
    render(<RegionFacts data={data} numbers={{ "src-teste-01": 1 }} />);
    expect(screen.getByText("DOX · Sistema Exemplo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Uva A" })).toHaveAttribute("href", "/uvas/uva-a");
    expect(screen.getByText("Nota da fonte sobre a uva.")).toBeInTheDocument();
  });
});

describe("ofCountry", () => {
  it("usa o artigo certo de cada país", () => {
    expect(ofCountry({ id: "br", name: "Brasil" })).toBe("do Brasil");
    expect(ofCountry({ id: "us", name: "Estados Unidos" })).toBe("dos Estados Unidos");
    expect(ofCountry({ id: "xx", name: "País X" })).toBe("de País X");
  });
});
