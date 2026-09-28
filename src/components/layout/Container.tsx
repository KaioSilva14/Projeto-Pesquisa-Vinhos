import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/** Largura máxima e margens laterais do grid (DESIGN.md §4.2: 16, 24, 32, 40 e 48 px). */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-content px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12",
        className,
      )}
      {...props}
    />
  );
}
