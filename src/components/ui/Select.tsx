"use client";

import { Select as SelectPrimitive } from "radix-ui";
import { useId } from "react";

import { cn } from "@/lib/cn";

import { CaretDownIcon, CheckIcon } from "./icons";
import { fieldClassName } from "./Input";

export type SelectOption = { value: string; label: string };

type SelectProps = {
  label: string;
  hideLabel?: boolean;
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Com `name`, o valor é enviado em formulários (o Radix cria um <select> escondido). */
  name?: string;
  disabled?: boolean;
  className?: string;
};

/** Lista de escolha única, com rótulo acima e navegação por teclado (DESIGN.md §7.3). */
export function Select({
  label,
  hideLabel = false,
  options,
  placeholder = "Selecione",
  className,
  ...rootProps
}: SelectProps) {
  const id = useId();

  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-small font-medium", hideLabel && "sr-only")}>
        {label}
      </label>
      <SelectPrimitive.Root {...rootProps}>
        <SelectPrimitive.Trigger
          id={id}
          className={cn(
            fieldClassName,
            "flex items-center justify-between gap-2 text-left data-placeholder:text-text-subtle",
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <CaretDownIcon aria-hidden className="size-4 text-text-muted" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            collisionPadding={16}
            className="z-40 max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-border bg-surface-raised shadow-md data-[state=open]:animate-pop-in"
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex h-11 cursor-default items-center rounded-sm pr-3 pl-9 text-body outline-none select-none data-disabled:opacity-50 data-highlighted:bg-sunken"
                >
                  <SelectPrimitive.ItemIndicator className="absolute left-3">
                    <CheckIcon aria-hidden className="size-4 text-accent" />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
