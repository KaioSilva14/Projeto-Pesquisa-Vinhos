import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { BottomNav } from "@/components/layout/BottomNav";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { NavLink } from "@/components/layout/NavLink";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink";

// Fora do Next não existe URL atual: simulamos o usePathname
const pathname = vi.hoisted(() => ({ current: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.current }));

beforeEach(() => {
  pathname.current = "/";
});

describe("NavLink", () => {
  it("marca aria-current na seção atual, inclusive em subpáginas", () => {
    pathname.current = "/uvas/exemplo";
    render(
      <>
        <NavLink href="/uvas">Uvas</NavLink>
        <NavLink href="/regioes">Regiões</NavLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Uvas" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Regiões" })).not.toHaveAttribute("aria-current");
  });
});

describe("BottomNav", () => {
  it("tem os 4 destinos e marca o atual", () => {
    pathname.current = "/favoritos";
    render(<BottomNav />);
    const nav = screen.getByRole("navigation", { name: "Navegação inferior" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      "Início",
      "Pesquisar",
      "Explorar",
      "Favoritos",
    ]);
    expect(within(nav).getByRole("link", { name: "Favoritos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("link", { name: "Início" })).not.toHaveAttribute("aria-current");
  });
});

describe("Breadcrumbs", () => {
  const items = [
    { label: "Início", href: "/" },
    { label: "Uvas", href: "/uvas" },
    { label: "Uva Exemplo", href: "/uvas/exemplo" },
  ];

  it("marca a página atual sem transformá-la em link", () => {
    render(<Breadcrumbs items={items} />);
    const current = screen.getByText("Uva Exemplo");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.closest("a")).toBeNull();
  });

  it("tem o atalho para o nível anterior (versão do celular)", () => {
    render(<Breadcrumbs items={items} />);
    const nav = screen.getByRole("navigation", { name: "Trilha de navegação" });
    const uvasLinks = within(nav).getAllByRole("link", { name: "Uvas" });
    expect(uvasLinks.every((link) => link.getAttribute("href") === "/uvas")).toBe(true);
  });
});

describe("SiteFooter", () => {
  it("mostra o aviso de consumo responsável para maiores de 18 anos", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent(/proibidas para menores de 18 anos/);
  });
});

describe("SkipLink", () => {
  it("aponta para o conteúdo principal", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Pular para o conteúdo" })).toHaveAttribute(
      "href",
      "#conteudo",
    );
  });
});
