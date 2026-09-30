import Link from "next/link";
import type { ReactNode } from "react";

import { formatPercent } from "@/lib/format";
import type { Wine } from "@/schemas/wine";
import type { GrapeRef } from "@/lib/wines/page-data";

type GrapeCompositionProps = {
  composition: NonNullable<Wine["grapes"]>;
  grapes: Readonly<Record<string, GrapeRef>>;
  /** Nota de fonte, logo depois das uvas (antes da explicação do que falta). */
  cite?: ReactNode;
};

/**
 * Uvas do vinho (DESIGN.md §7.8): percentual só quando a fonte informa. A nota da composição
 * explica o que falta (ex.: uva ainda fora do catálogo).
 */
export function GrapeComposition({ composition, grapes, cite }: GrapeCompositionProps) {
  const items = composition.value.flatMap((item) => {
    const grape = grapes[item.grapeId];
    return grape ? [{ ...item, grape }] : [];
  });

  return (
    <span className="grid gap-1">
      <span className="flex flex-wrap gap-x-3 gap-y-1">
        {items.map(({ grapeId, grape, percentage, isMain }) => (
          <span key={grapeId}>
            <Link
              href={`/uvas/${grape.slug}`}
              className="underline decoration-border-strong underline-offset-4 hover:decoration-accent"
            >
              {grape.name}
            </Link>
            {percentage !== undefined ? (
              <span className="text-text-muted tabular-nums"> {formatPercent(percentage)}</span>
            ) : (
              isMain && <span className="text-text-muted"> (principal)</span>
            )}
          </span>
        ))}
        {cite}
      </span>
      {composition.notes && <span className="text-small text-text-muted">{composition.notes}</span>}
    </span>
  );
}
