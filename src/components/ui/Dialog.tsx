"use client";

// Radix cuida do comportamento acessível (foco preso, Esc fecha, foco volta ao botão que abriu);
// aqui ficam só os estilos do Vinum (DESIGN.md §7.7, ANIMATIONS.md A07).

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { IconButton } from "./IconButton";
import { XIcon } from "./icons";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/** Fundo escurecido compartilhado por Dialog e Sheet. */
export const overlayClassName =
  "fixed inset-0 z-50 bg-scrim data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out";

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Obrigatório: é o nome do diálogo para leitores de tela. */
  title: string;
  description?: string;
};

export function DialogContent({
  title,
  description,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClassName} />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-1/2 left-1/2 z-60 grid max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-md bg-surface p-6 shadow-lg",
          "data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in",
          className,
        )}
        // Sem descrição, avisa o Radix que isso é intencional (evita um alerta no console)
        {...(!description && { "aria-describedby": undefined })}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-1">
            <DialogPrimitive.Title className="font-serif text-h3">{title}</DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-body text-text-muted">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close asChild>
            <IconButton aria-label="Fechar" className="-mt-2 -mr-2">
              <XIcon aria-hidden />
            </IconButton>
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
