"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ReactElement, ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  /** Elemento focável que recebe a dica (ex.: um IconButton). */
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
};

/**
 * Dica curta ao passar o mouse ou focar pelo teclado (DESIGN.md §7.7).
 * Nunca guarde aqui informação essencial: no celular não há "passar o mouse".
 */
export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={300}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            collisionPadding={8}
            className="z-40 max-w-xs rounded-sm bg-text px-2.5 py-1.5 text-small text-bg shadow-md data-[state=closed]:animate-pop-out data-[state=delayed-open]:animate-pop-in"
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
