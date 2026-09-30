import { Cite } from "@/components/sources/Cite";
import { formatNumber, formatPercent } from "@/lib/format";
import type { CitationNumbers } from "@/lib/wines/citations";
import type { GrapeRef } from "@/lib/wines/page-data";
import type { Vintage } from "@/schemas/vintage";

import { FactList } from "./FactList";
import { GrapeComposition } from "./GrapeComposition";

type VintageListProps = {
  vintages: readonly Vintage[];
  grapes: Readonly<Record<string, GrapeRef>>;
  numbers: CitationNumbers;
};

/** Uma ficha por safra com o que a ficha técnica daquela safra informa (DATA_MODEL.md §3.9). */
export function VintageList({ vintages, grapes, numbers }: VintageListProps) {
  return (
    <div className="grid gap-4">
      {vintages.map((vintage) => (
        <article key={vintage.id} className="grid gap-4 rounded-sm border border-border p-4 md:p-5">
          <h3 className="font-serif text-h4">Safra {vintage.year}</h3>
          <FactList
            numbers={numbers}
            facts={[
              vintage.alcoholPercent && {
                label: "Teor alcoólico",
                value: formatPercent(vintage.alcoholPercent.value),
                sourceIds: vintage.alcoholPercent.sourceIds,
              },
              vintage.grapes && {
                label: "Uvas",
                value: (
                  <GrapeComposition
                    composition={vintage.grapes}
                    grapes={grapes}
                    cite={<Cite ids={vintage.grapes.sourceIds} numbers={numbers} />}
                  />
                ),
              },
              vintage.residualSugarGL && {
                label: "Açúcar residual",
                value: `${formatNumber(vintage.residualSugarGL.value)} g/L`,
                sourceIds: vintage.residualSugarGL.sourceIds,
              },
              vintage.totalAcidityGL && {
                label: "Acidez total",
                value: `${formatNumber(vintage.totalAcidityGL.value)} g/L`,
                sourceIds: vintage.totalAcidityGL.sourceIds,
              },
              vintage.ph && {
                label: "pH",
                value: formatNumber(vintage.ph.value),
                sourceIds: vintage.ph.sourceIds,
              },
              vintage.aging && {
                label: "Estágio",
                value: vintage.aging.value,
                sourceIds: vintage.aging.sourceIds,
              },
              vintage.technicalSheetUrl && {
                label: "Ficha técnica",
                value: (
                  <a
                    href={vintage.technicalSheetUrl.value}
                    rel="noopener noreferrer"
                    className="underline decoration-border-strong underline-offset-4 hover:decoration-accent"
                  >
                    Ficha oficial da safra {vintage.year}
                  </a>
                ),
                sourceIds: vintage.technicalSheetUrl.sourceIds,
              },
            ]}
          />
        </article>
      ))}
    </div>
  );
}
