"use client";

// Painel que sobe da parte de baixo da tela (bottom sheet), usado para filtros no celular
// (DESIGN.md §7.7 e §12, ANIMATIONS.md A08). É um Dialog do Radix com outro visual.

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { overlayClassName } from "./Dialog";
import { IconButton } from "./IconButton";
import { XIcon } from "./icons";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

type SheetContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  title: string;
  description?: string;
  /** Rodapé fixo, ex.: "Limpar" + "Ver N vinhos". */
  footer?: ReactNode;
};

export function SheetContent({
  title,
  description,
  footer,
  className,
  children,
  ...props
}: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-60 flex max-h-[85dvh] flex-col rounded-t-lg bg-surface shadow-lg",
          "data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in",
          className,
        )}
        {...(!description && { "aria-describedby": undefined })}
        {...props}
      >
        {/* Cabeçalho fixo: título e fechar ficam sempre visíveis ao rolar o conteúdo */}
        <div className="flex items-center justify-between gap-4 border-b border-border py-2 pr-2 pl-4">
          <div className="grid">
            <DialogPrimitive.Title className="text-h4 font-semibold">{title}</DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-small text-text-muted">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {/* Fechar por botão é obrigatório; arrastar seria só um atalho (WCAG 2.5.7) */}
          <DialogPrimitive.Close asChild>
            <IconButton aria-label="Fechar">
              <XIcon aria-hidden />
            </IconButton>
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
        {footer && (
          <div className="flex gap-3 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
