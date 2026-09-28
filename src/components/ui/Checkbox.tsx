"use client";

import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { useId, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { CheckIcon } from "./icons";

type CheckboxProps = Omit<ComponentProps<typeof CheckboxPrimitive.Root>, "id" | "children"> & {
  label: string;
  /** Quantidade de resultados da opção (filtros), mostrada à direita. */
  count?: number;
};

/**
 * Caixa de seleção com rótulo clicável; a linha inteira tem 44 px de altura para o toque
 * (DESIGN.md §7.3 e §12).
 */
export function Checkbox({ label, count, className, ...props }: CheckboxProps) {
  const id = useId();

  return (
    <div className={cn("flex min-h-11 items-center gap-3", className)}>
      <CheckboxPrimitive.Root
        id={id}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface",
          "data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-on-accent",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <CheckIcon aria-hidden weight="bold" className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={id}
        className="flex flex-1 cursor-pointer items-center justify-between gap-2 py-2.5 text-body"
      >
        {label}
        {count !== undefined && (
          <span className="text-small text-text-subtle tabular-nums">
            <span className="sr-only">,</span> {count}
          </span>
        )}
      </label>
    </div>
  );
}
