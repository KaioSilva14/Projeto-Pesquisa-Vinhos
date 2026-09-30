import Link from "next/link";

import { HeartIcon, MagnifyingGlassIcon } from "@/components/ui/icons";
import { SearchCombobox } from "@/components/search/SearchCombobox";
import { MAIN_NAV } from "@/config/nav";
import { SITE } from "@/config/site";

import { Container } from "./Container";
import { NavLink } from "./NavLink";

const iconLink =
  "inline-flex size-11 items-center justify-center rounded-sm text-text hover:bg-sunken aria-[current=page]:text-accent [&_svg]:size-6";

/**
 * Cabeçalho fixo (DESIGN.md §7.6): 56 px no celular, 64 px a partir do tablet.
 * No celular só logo e busca; o menu fica na barra inferior (BottomNav).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg">
      <Container className="flex h-14 items-center gap-4 md:h-16 lg:gap-8">
        <Link href="/" className="font-serif text-h3 leading-none">
          {SITE.name}
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-2">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="inline-flex h-11 items-center rounded-sm px-2 text-small text-text-muted hover:text-text aria-[current=page]:text-accent lg:text-body"
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {/* Formulário GET comum: sem JavaScript, o Enter leva a /pesquisa; com ele, há sugestões */}
          <form action="/pesquisa" role="search" className="hidden w-72 lg:block">
            <SearchCombobox
              label="Pesquisar vinhos, uvas, regiões e produtores"
              placeholder="Pesquisar"
              shortcutHint="/"
              popupClassName="right-0 w-[min(28rem,calc(100vw-2rem))]"
            />
          </form>
          <NavLink href="/pesquisa" aria-label="Pesquisar" className={`${iconLink} lg:hidden`}>
            <MagnifyingGlassIcon aria-hidden />
          </NavLink>
          <NavLink href="/favoritos" aria-label="Favoritos" className={`${iconLink} max-md:hidden`}>
            <HeartIcon aria-hidden />
          </NavLink>
        </div>
      </Container>
    </header>
  );
}
