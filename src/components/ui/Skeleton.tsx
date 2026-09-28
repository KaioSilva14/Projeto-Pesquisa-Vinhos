import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Bloco de carregamento com a forma do conteúdo final (DESIGN.md §7.1).
 * Escondido de leitores de tela: anuncie o carregamento no contêiner, por exemplo
 * `role="status"` + texto `sr-only` "Carregando".
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-sm bg-sunken motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}
