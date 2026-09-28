import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

const iconButtonVariants = cva(
  [
    "inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-text",
    "transition-[background-color,color,transform] duration-(--duration-fast) ease-out",
    "disabled:cursor-not-allowed disabled:opacity-50 motion-safe:enabled:active:scale-[0.98]",
    "aria-pressed:bg-accent-soft aria-pressed:text-accent",
    "[&_svg]:size-5",
  ],
  {
    variants: {
      variant: {
        ghost: "enabled:hover:bg-sunken",
        secondary: "border border-border-strong enabled:hover:bg-sunken",
      },
    },
    defaultVariants: { variant: "ghost" },
  },
);

type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    /** Obrigatório: o botão só tem ícone, então o nome vem daqui (DESIGN.md §7.2). */
    "aria-label": string;
  };

/** Botão de 44×44 px só com ícone. Passe o ícone como filho, com `aria-hidden`. */
export function IconButton({ className, variant, type = "button", ...props }: IconButtonProps) {
  return (
    <button type={type} className={cn(iconButtonVariants({ variant }), className)} {...props} />
  );
}
