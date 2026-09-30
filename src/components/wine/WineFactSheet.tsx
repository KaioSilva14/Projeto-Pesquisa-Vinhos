import Link from "next/link";
import type { ReactNode } from "react";

import { Cite } from "@/components/sources/Cite";
import { formatList, formatTemperatureRange, formatVolume } from "@/lib/format";
import { SPARKLING_SWEETNESS_LABELS, WINE_TYPE_LABELS } from "@/lib/labels";
import type { CitationNumbers } from "@/lib/citations";
import type { WinePageData } from "@/lib/wines/page-data";

import { FactList, presentFacts, type MaybeFact } from "@/components/facts/FactList";
import { GrapeComposition } from "./GrapeComposition";

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";
const internal = (href: string, text: string): ReactNode => (
  <Link href={href} className={linkClass}>
    {text}
  </Link>
);

type WineFactSheetProps = {
  data: WinePageData;
  numbers: CitationNumbers;
};

/**
 * Ficha técnica em blocos Origem · Composição · Serviço (DESIGN.md §7.8). Campo sem dado não
 * aparece; bloco sem nenhum campo também não.
 */
export function WineFactSheet({ data, numbers }: WineFactSheetProps) {
  const { wine, producer, region, country, grapes } = data;
  const general = wine.sourceIds;

  const groups: { title: string; facts: MaybeFact[] }[] = [
    {
      title: "Origem",
      facts: [
        producer && {
          label: "Produtor",
          value: internal(`/produtores/${producer.slug}`, producer.name),
          sourceIds: general,
        },
        region && {
          label: "Região",
          value: internal(`/regioes/${region.slug}`, region.name),
          sourceIds: general,
        },
        country && {
          label: "País",
          value: internal(`/paises/${country.slug}`, country.name),
          sourceIds: general,
        },
        { label: "Tipo", value: WINE_TYPE_LABELS[wine.type.value], sourceIds: wine.type.sourceIds },
        wine.sparklingSweetness && {
          label: "Categoria",
          value: SPARKLING_SWEETNESS_LABELS[wine.sparklingSweetness.value],
          sourceIds: wine.sparklingSweetness.sourceIds,
        },
        wine.isNonVintage?.value && {
          label: "Safra",
          value: "Multissafra (vinhos de mais de um ano)",
          sourceIds: wine.isNonVintage.sourceIds,
        },
        wine.officialPageUrl && {
          label: "Página oficial",
          value: (
            <a href={wine.officialPageUrl.value} rel="noopener noreferrer" className={linkClass}>
              Site do produtor
            </a>
          ),
          sourceIds: wine.officialPageUrl.sourceIds,
        },
      ],
    },
    {
      title: "Composição",
      facts: [
        wine.grapes && {
          label: "Uvas",
          value: (
            <GrapeComposition
              composition={wine.grapes}
              grapes={grapes}
              cite={<Cite ids={wine.grapes.sourceIds} numbers={numbers} />}
            />
          ),
        },
        wine.productionMethod && {
          label: "Elaboração",
          value: wine.productionMethod.value,
          sourceIds: wine.productionMethod.sourceIds,
        },
      ],
    },
    {
      title: "Serviço",
      facts: [
        wine.servingTemperature && {
          label: "Temperatura de serviço",
          value: formatTemperatureRange(wine.servingTemperature.value),
          sourceIds: wine.servingTemperature.sourceIds,
        },
        wine.volumeMl && {
          label: "Garrafas",
          value: formatList(wine.volumeMl.value.map(formatVolume)),
          sourceIds: wine.volumeMl.sourceIds,
        },
        wine.agingPotential && {
          label: "Potencial de guarda",
          value: wine.agingPotential.value,
          sourceIds: wine.agingPotential.sourceIds,
        },
      ],
    },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {groups
        .filter((group) => presentFacts(group.facts).length > 0)
        .map((group) => (
          <div key={group.title} className="grid content-start gap-3">
            <h3 className="font-semibold">{group.title}</h3>
            <FactList facts={group.facts} numbers={numbers} />
          </div>
        ))}
    </div>
  );
}
