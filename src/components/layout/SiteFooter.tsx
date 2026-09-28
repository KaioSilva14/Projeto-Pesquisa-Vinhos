import Link from "next/link";

import { FOOTER_NAV } from "@/config/nav";
import { SITE } from "@/config/site";

import { Container } from "./Container";

/**
 * Rodapé de todas as páginas, com o aviso permanente de consumo responsável
 * (CLAUDE.md §21, ADR-012, PRD RF16).
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface md:mt-24">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:py-16">
        <div className="grid content-start gap-3">
          <p className="font-serif text-h3">{SITE.name}</p>
          <p className="max-w-lead text-small text-text-muted">
            Conteúdo informativo sobre vinhos, com fontes citadas. Sem venda e sem publicidade.
          </p>
        </div>

        {FOOTER_NAV.map((group) => (
          <nav key={group.title} aria-label={`Rodapé: ${group.title}`}>
            <p className="mb-3 text-small font-semibold">{group.title}</p>
            <ul className="grid gap-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-small text-text-muted hover:text-text md:min-h-8"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      {/* No celular, espaço extra no fim para a barra inferior (fixa) não cobrir o aviso */}
      <div className="border-t border-border pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <Container className="grid gap-2 py-6 text-small text-text-muted">
          <p>
            <strong className="font-semibold text-text">
              Bebidas alcoólicas são proibidas para menores de 18 anos.
            </strong>{" "}
            Se beber, faça com moderação e não dirija.
          </p>
          <p className="text-caption text-text-subtle">
            © {new Date().getFullYear()} {SITE.name}. Informações com fonte registrada em cada
            página.
          </p>
        </Container>
      </div>
    </footer>
  );
}
