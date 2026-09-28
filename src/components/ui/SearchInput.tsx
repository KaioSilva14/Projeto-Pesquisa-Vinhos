"use client";

// Client Component: precisa de estado para mostrar/esconder o botão de limpar.

import { useId, useRef, useState, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { MagnifyingGlassIcon, XIcon } from "./icons";
import { fieldClassName } from "./Input";

type SearchInputProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  /** Rótulo para leitores de tela (o campo não tem rótulo visível). */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Tecla de atalho exibida no desktop quando o campo está vazio, ex.: "/". */
  shortcutHint?: string;
};

export function SearchInput({
  label,
  value,
  defaultValue = "",
  onValueChange,
  shortcutHint,
  className,
  id,
  ...props
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  // Funciona controlado (com `value`) ou sozinho (estado interno)
  const currentValue = value ?? internalValue;

  function update(next: string) {
    setInternalValue(next);
    onValueChange?.(next);
  }

  function clear() {
    update("");
    inputRef.current?.focus();
  }

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <MagnifyingGlassIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-text-subtle"
      />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        value={currentValue}
        onChange={(event) => update(event.target.value)}
        aria-keyshortcuts={shortcutHint}
        className={cn(
          fieldClassName,
          "h-12 pr-12 pl-11",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
        {...props}
      />
      {currentValue ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Limpar pesquisa"
          className="absolute top-1/2 right-0.5 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-sm text-text-muted hover:text-text"
        >
          <XIcon aria-hidden className="size-5" />
        </button>
      ) : (
        shortcutHint && (
          <kbd
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-sm border border-border-strong px-1.5 text-caption text-text-muted md:inline-block"
          >
            {shortcutHint}
          </kbd>
        )
      )}
    </div>
  );
}
