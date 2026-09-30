"use client";

// Client Component: o crédito da foto abre num popover (Radix) dentro de cards.

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import type { ImageAsset } from "@/schemas/image-asset";

import { ImageCredit } from "./ImageCredit";

type CreditButtonProps = {
  image: ImageAsset;
  className?: string;
};

/** Em cards, o crédito fica num botão "Créditos" para não poluir (DESIGN.md §7.8). */
export function CreditButton({ image, className }: CreditButtonProps) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Créditos da foto: ${image.alt}`}
        className={
          className ??
          "relative z-10 inline-flex min-h-11 items-center text-caption text-text-subtle underline underline-offset-2 hover:text-text md:min-h-6"
        }
      >
        Créditos
      </PopoverTrigger>
      <PopoverContent>
        <ImageCredit image={image} />
      </PopoverContent>
    </Popover>
  );
}
