import { useId, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { WarningCircleIcon } from "./icons";

// Base visual compartilhada com o SearchInput. Fonte de 16 px evita o zoom automático do iOS.
export const fieldClassName = cn(
  "h-11 w-full rounded-sm border border-border-strong bg-surface px-3 text-body text-text",
  "placeholder:text-text-subtle disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-danger",
);

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  /** Texto do rótulo, sempre acima do campo (nunca só placeholder). */
  label: string;
  /** Esconde o rótulo visualmente, mas mantém para leitores de tela. */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  id?: string;
};

export function Input({
  label,
  hideLabel = false,
  hint,
  error,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ");

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className={cn("text-small font-medium", hideLabel && "sr-only")}>
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        className={cn(fieldClassName, className)}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-small text-text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-small text-danger">
          <WarningCircleIcon aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
