import Link from "next/link";

import { CaretLeftIcon } from "@/components/ui/icons";

export type BreadcrumbItem = { label: string; href: string };

type BreadcrumbsProps = {
  /** Caminho do início até a página atual. O último item é a página atual. */
  items: readonly BreadcrumbItem[];
};

const linkClass = "text-text-muted underline-offset-4 hover:text-text hover:underline";

/**
 * Trilha de navegação das páginas internas (DESIGN.md §7.6, PRD RF17).
 * No celular mostra só o nível anterior ("‹ Regiões"), para não quebrar em várias linhas.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const parent = items.at(-2);
  // TODO(F10-01): gerar também o JSON-LD BreadcrumbList a partir de `items`

  return (
    <nav aria-label="Trilha de navegação" className="text-small">
      {parent && (
        <Link
          href={parent.href}
          className={`${linkClass} inline-flex min-h-11 items-center gap-1 md:hidden`}
        >
          <CaretLeftIcon aria-hidden className="size-4" />
          {parent.label}
        </Link>
      )}
      <ol className="hidden flex-wrap items-center gap-x-2 md:flex">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="text-text-subtle">
                  /
                </span>
              )}
              {isCurrent ? (
                <span aria-current="page" className="text-text">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
