import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-small [&_svg]:size-4",
  {
    variants: {
      variant: {
        // Tipo de vinho, estilo, denominação: sempre neutro, sem cor por tipo (DESIGN.md §2.3)
        neutral: "bg-sunken text-text-muted",
        // Avisos, como o selo "Dados de demonstração"
        warning: "border border-warning text-warning",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
