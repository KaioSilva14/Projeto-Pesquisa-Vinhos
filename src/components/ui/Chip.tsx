import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { CheckIcon, XIcon } from "./icons";

// 44 px de altura no toque; 36 px a partir do tablet, onde há mouse
const chipBase = cn(
  "inline-flex h-11 items-center gap-1.5 rounded-pill border px-3.5 text-small md:h-9",
  "transition-colors duration-(--duration-fast) ease-out [&_svg]:size-4",
);

const chipState = (selected: boolean) =>
  selected
    ? "border-accent bg-accent-soft text-accent"
    : "border-border-strong text-text hover:bg-sunken";

function ChipContent({
  selected,
  count,
  children,
}: {
  selected: boolean;
  count: number | undefined;
  children: ReactNode;
}) {
  return (
    <>
      {selected && <CheckIcon aria-hidden />}
      {children}
      {count !== undefined && (
        <span className="text-text-subtle tabular-nums">
          <span className="sr-only">,</span> {count}
        </span>
      )}
    </>
  );
}

type FilterChipProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  selected: boolean;
  /** Quantidade de resultados da opção (só mostrar opções que existem nos dados). */
  count?: number;
};

/** Opção de filtro que liga/desliga (DESIGN.md §7.4). */
export function FilterChip({
  selected,
  count,
  className,
  children,
  type = "button",
  ...props
}: FilterChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(chipBase, chipState(selected), className)}
      {...props}
    >
      <ChipContent selected={selected} count={count}>
        {children}
      </ChipContent>
    </button>
  );
}

type FilterChipLinkProps = Omit<ComponentProps<typeof Link>, "aria-current"> & {
  selected: boolean;
  count?: number;
};

/**
 * Opção de filtro que é um link (a URL guarda o filtro): funciona sem JavaScript.
 * A opção ativa é marcada com aria-current.
 */
export function FilterChipLink({
  selected,
  count,
  className,
  children,
  ...props
}: FilterChipLinkProps) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={cn(chipBase, chipState(selected), className)}
      {...props}
    >
      <ChipContent selected={selected} count={count}>
        {children}
      </ChipContent>
    </Link>
  );
}

type ActiveFilterChipProps = Omit<ComponentProps<"button">, "children" | "aria-label"> & {
  label: string;
};

/** Filtro aplicado: o chip inteiro é o botão de remover. */
export function ActiveFilterChip({
  label,
  className,
  type = "button",
  ...props
}: ActiveFilterChipProps) {
  return (
    <button
      type={type}
      aria-label={`Remover filtro: ${label}`}
      className={cn(
        chipBase,
        "border-transparent bg-accent-soft text-accent hover:border-accent",
        className,
      )}
      {...props}
    >
      {label}
      <XIcon aria-hidden />
    </button>
  );
}
