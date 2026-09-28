import Link from "next/link";

import { buttonVariants } from "@/components/ui/Button";
import { MagnifyingGlassIcon } from "@/components/ui/icons";

import { EmptyState } from "./EmptyState";

type NoResultsProps = {
  /** Texto pesquisado, se houver. */
  query?: string;
  /** Link que remove filtros/pesquisa (ex.: "/vinhos"). Sem ele, o botão não aparece. */
  clearHref?: string;
  clearLabel?: string;
};

/** Pesquisa ou filtros sem resultados, com dicas para tentar de novo (DESIGN.md §7.9). */
export function NoResults({ query, clearHref, clearLabel = "Limpar filtros" }: NoResultsProps) {
  const title = query ? `Nenhum resultado para “${query}”` : "Nenhum resultado";

  return (
    <div role="status">
      <EmptyState
        icon={<MagnifyingGlassIcon aria-hidden weight="light" />}
        title={title}
        description="Confira a grafia, use termos mais gerais ou remova alguns filtros."
        action={
          clearHref && (
            <Link href={clearHref} className={buttonVariants({ variant: "secondary" })}>
              {clearLabel}
            </Link>
          )
        }
      />
    </div>
  );
}
