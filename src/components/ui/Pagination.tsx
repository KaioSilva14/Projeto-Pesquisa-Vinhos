import Link from "next/link";

import { cn } from "@/lib/cn";

import { buttonVariants } from "./Button";
import { CaretLeftIcon, CaretRightIcon } from "./icons";

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Endereço de cada página (a página fica na URL: compartilhável e sem JavaScript). */
  hrefFor: (page: number) => string;
  className?: string;
};

/** Anterior / Página X de Y / Próxima. Some quando há só uma página. */
export function Pagination({ page, totalPages, hrefFor, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const secondary = buttonVariants({ variant: "secondary" });

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex items-center justify-between gap-4", className)}
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={secondary}>
          <CaretLeftIcon aria-hidden />
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <p className="text-small text-text-muted tabular-nums">
        Página {page} de {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={secondary}>
          Próxima
          <CaretRightIcon aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
