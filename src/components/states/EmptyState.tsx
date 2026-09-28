import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type EmptyStateProps = {
  /** Ícone Phosphor em peso "light" (DESIGN.md §6), passado já com aria-hidden. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Ação para sair do vazio (ex.: link "Explorar vinhos"). */
  action?: ReactNode;
  /** Nível do título, para respeitar a hierarquia da página (padrão: h2). */
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * Base de todos os estados sem conteúdo (DESIGN.md §7.9): lista vazia, sem resultados,
 * página não encontrada, erro. Explica o que aconteceu e oferece um próximo passo.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  headingLevel: Heading = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-lead justify-items-center gap-4 py-12 text-center md:py-16",
        className,
      )}
    >
      {icon && <div className="text-text-subtle [&_svg]:size-12">{icon}</div>}
      <Heading className="font-serif text-h3 text-balance">{title}</Heading>
      {description && <p className="text-body text-pretty text-text-muted">{description}</p>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
