// Menus do site num lugar só. As rotas seguem ARCHITECTURE.md §4 e são criadas nas fases 3 a 6;
// até lá, os links levam à página 404.

export type NavItem = { label: string; href: string };

/** Menu principal do cabeçalho (tablet e desktop), em uma linha (DESIGN.md §7.6). */
export const MAIN_NAV: readonly NavItem[] = [
  { label: "Vinhos", href: "/vinhos" },
  { label: "Uvas", href: "/uvas" },
  { label: "Regiões", href: "/regioes" },
  { label: "Produtores", href: "/produtores" },
  { label: "Harmonizações", href: "/harmonizacoes" },
];

/** Barra inferior do celular: 4 destinos (os ícones ficam no componente BottomNav). */
export const BOTTOM_NAV = {
  home: { label: "Início", href: "/" },
  search: { label: "Pesquisar", href: "/pesquisa" },
  explore: { label: "Explorar", href: "/explorar" },
  favorites: { label: "Favoritos", href: "/favoritos" },
} as const satisfies Record<string, NavItem>;

/** Links do rodapé: o mesmo lugar em todas as páginas (WCAG 3.2.6). */
export const FOOTER_NAV: readonly { title: string; items: readonly NavItem[] }[] = [
  { title: "Explorar", items: [...MAIN_NAV, { label: "Países", href: "/paises" }] },
  {
    title: "Projeto",
    items: [
      { label: "Sobre o Vinum", href: "/sobre" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Sugerir uma correção", href: "/sugerir-correcao" },
      { label: "Privacidade", href: "/privacidade" },
    ],
  },
];

/**
 * Link ativo: a home só quando o caminho é exatamente "/"; as demais seções também
 * nas subpáginas (ex.: /uvas/malbec ativa "Uvas").
 */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
