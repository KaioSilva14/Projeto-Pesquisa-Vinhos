import { useId, type ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { WarningCircleIcon } from "./icons";

type TextareaProps = Omit<ComponentProps<"textarea">, "id" | "value" | "maxLength"> & {
  /** Texto do rótulo, sempre acima do campo. */
  label: string;
  hint?: string;
  error?: string;
  value: string;
  /** Limite de caracteres: o campo não aceita mais que isso e mostra o contador. */
  maxLength: number;
};

/** Campo de texto longo com contador de caracteres (DESIGN.md §7.3). */
export function Textarea({
  label,
  hint,
  error,
  value,
  maxLength,
  className,
  ...props
}: TextareaProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const counterId = `${id}-contador`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, counterId, error && errorId].filter(Boolean).join(" ");
  const nearLimit = value.length >= maxLength * 0.9;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-small font-medium">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-36 w-full rounded-sm border border-border-strong bg-surface px-3 py-2.5 text-body text-text",
          "placeholder:text-text-subtle aria-invalid:border-danger",
          className,
        )}
        {...props}
      />
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        {hint && (
          <p id={hintId} className="text-small text-text-subtle">
            {hint}
          </p>
        )}
        <p
          id={counterId}
          className={cn(
            "ml-auto text-small tabular-nums",
            nearLimit ? "text-warning" : "text-text-subtle",
          )}
        >
          {value.length} de {maxLength} caracteres
        </p>
      </div>
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-small text-danger">
          <WarningCircleIcon aria-hidden className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
