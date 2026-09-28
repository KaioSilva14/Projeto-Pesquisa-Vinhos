import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Contêiner de uma entidade clicável (DESIGN.md §7.5). Sem sombra: agrupa por espaço e borda.
 * O clique no card inteiro vem do `CardLink`; botões internos (ex.: favoritar) precisam de
 * `relative z-10` para ficar acima da área do link.
 */
export function Card({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 rounded-sm border border-border bg-surface p-4 md:p-5",
        "transition-colors duration-(--duration-fast) ease-out",
        "has-[[data-card-link]:hover]:border-border-strong",
        // O anel de foco aparece no card inteiro, não só no texto do link
        "has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-2 has-[[data-card-link]:focus-visible]:outline-accent",
        className,
      )}
      {...props}
    />
  );
}

/** Link do título do card. Um pseudo-elemento estende a área clicável ao card todo. */
export function CardLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      data-card-link=""
      className={cn(
        "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
