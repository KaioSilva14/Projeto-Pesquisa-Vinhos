import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// O tailwind-merge só conhece os nomes padrão do Tailwind. Sem registrar os tokens do
// globals.css, ele confundiria `text-h1` (tamanho) com `text-text` (cor) e apagaria um deles.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "h1",
        "h2",
        "h3",
        "h4",
        "lead",
        "body-lg",
        "body",
        "small",
        "caption",
        "overline",
      ],
      radius: ["media", "pill"],
      container: ["content", "wide", "lead"],
    },
  },
});

/** Junta classes condicionais e resolve conflitos (a última classe vence). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
