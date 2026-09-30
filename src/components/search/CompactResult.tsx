import Link from "next/link";

import { SEARCH_KIND_LABELS } from "@/lib/labels";
import type { SearchDocument } from "@/lib/search/types";

type CompactResultProps = {
  document: SearchDocument;
};

/**
 * Linha de resultado para listas densas (DESIGN.md §7.5): nome, contexto e tipo.
 * Sem miniatura por enquanto: foto exige crédito visível, que não cabe em 48 px (IMAGES.md).
 */
export function CompactResult({ document }: CompactResultProps) {
  return (
    <Link
      href={document.href}
      className="flex min-h-16 items-center justify-between gap-4 rounded-md px-3 py-3 hover:bg-sunken focus-visible:bg-sunken"
    >
      <span className="grid min-w-0 gap-0.5">
        <span className="truncate font-serif text-h4">{document.name}</span>
        {document.subtitle && (
          <span className="truncate text-small text-text-muted">{document.subtitle}</span>
        )}
      </span>
      <span className="shrink-0 text-caption tracking-wide text-text-subtle uppercase">
        {SEARCH_KIND_LABELS[document.kind].one}
      </span>
    </Link>
  );
}
