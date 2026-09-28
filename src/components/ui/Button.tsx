import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

import { CircleNotchIcon } from "./icons";

// Exportado para estilizar links como botão: <Link className={buttonVariants()}>
export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,transform] duration-(--duration-fast) ease-out",
    "motion-safe:enabled:active:scale-[0.98]",
    "disabled:cursor-not-allowed disabled:not-aria-busy:opacity-50 aria-busy:cursor-wait",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-on-accent enabled:hover:bg-accent-hover",
        secondary: "border border-border-strong text-text enabled:hover:bg-sunken",
        ghost: "text-text enabled:hover:bg-sunken",
        link: "text-accent underline-offset-4 enabled:hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-small", // só desktop: abaixo do alvo de toque de 44 px
        md: "h-11 px-5 text-body",
        lg: "h-13 px-6 text-body-lg",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Mostra um indicador e bloqueia cliques, mantendo a largura do botão. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <CircleNotchIcon aria-hidden className="absolute size-5 motion-safe:animate-spin" />
      )}
      {/* Rótulo transparente (não removido): o botão mantém a largura e o nome acessível.
          `invisible` esconderia também dos leitores de tela. */}
      <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
    </button>
  );
}
