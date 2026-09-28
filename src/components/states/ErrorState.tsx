import type { ReactNode } from "react";

import { WarningCircleIcon } from "@/components/ui/icons";

import { EmptyState } from "./EmptyState";

type ErrorStateProps = {
  title?: string;
  description?: string;
  /** Botões de recuperação (ex.: "Tentar novamente", "Ir para o início"). */
  action?: ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
};

/** Falha ao carregar algo. Nunca mostra detalhes técnicos ao visitante (SECURITY.md). */
export function ErrorState({
  title = "Não foi possível carregar este conteúdo",
  description = "Pode ser uma falha temporária. Tente novamente em instantes.",
  action,
  headingLevel,
}: ErrorStateProps) {
  return (
    <div role="alert">
      <EmptyState
        icon={<WarningCircleIcon aria-hidden weight="light" className="text-danger" />}
        title={title}
        description={description}
        action={action}
        {...(headingLevel && { headingLevel })}
      />
    </div>
  );
}
