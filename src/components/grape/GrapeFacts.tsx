import Link from "next/link";
import { Fragment } from "react";

import { FactList } from "@/components/facts/FactList";
import type { CitationNumbers } from "@/lib/citations";
import { formatList } from "@/lib/format";
import type { GrapePageData } from "@/lib/grapes/page-data";
import { GRAPE_COLOR_LABELS } from "@/lib/labels";

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

type GrapeFactsProps = {
  data: GrapePageData;
  numbers: CitationNumbers;
};

/** Ficha da uva: só o que o VIVC e as fontes das regiões confirmam (DATA_MODEL.md §3.3). */
export function GrapeFacts({ data, numbers }: GrapeFactsProps) {
  const { grape, regions } = data;

  return (
    <FactList
      numbers={numbers}
      facts={[
        grape.color && {
          label: "Cor",
          value: GRAPE_COLOR_LABELS[grape.color.value],
          sourceIds: grape.color.sourceIds,
        },
        grape.origin && {
          label: "Origem",
          value: grape.origin.value,
          sourceIds: grape.origin.sourceIds,
        },
        grape.parentage && {
          label: "Parentesco",
          value: grape.parentage.value,
          sourceIds: grape.parentage.sourceIds,
        },
        grape.referenceName && {
          label: "Nome no catálogo internacional (VIVC)",
          value: grape.referenceName.value,
          sourceIds: grape.referenceName.sourceIds,
        },
        grape.synonyms && {
          label: "Outros nomes",
          value: formatList(grape.synonyms.value),
          sourceIds: grape.synonyms.sourceIds,
        },
        regions.length > 0 && {
          label: "Uva principal em",
          // Texto corrido ("Mendoza, Rioja"), para a nota da fonte ficar logo depois
          value: regions.map((region, index) => (
            <Fragment key={region.slug}>
              {index > 0 && ", "}
              <Link href={`/regioes/${region.slug}`} className={linkClass}>
                {region.name}
              </Link>
            </Fragment>
          )),
          sourceIds: grape.mainRegionIds?.sourceIds,
        },
      ]}
    />
  );
}
