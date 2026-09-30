import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import { Cite } from "@/components/sources/Cite";
import { DemoBadge } from "@/components/states/DemoBadge";
import { IncompleteDataNote } from "@/components/states/IncompleteDataNote";
import { Badge } from "@/components/ui/Badge";
import { SPARKLING_SWEETNESS_LABELS, WINE_TYPE_LABELS } from "@/lib/labels";
import type { CitationNumbers } from "@/lib/wines/citations";
import type { WinePageData } from "@/lib/wines/page-data";

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

type WineHeaderProps = {
  data: WinePageData;
  numbers: CitationNumbers;
};

/** Nome, produtor e origem como links, selos e resumo (DESIGN.md §8). */
export function WineHeader({ data, numbers }: WineHeaderProps) {
  const { wine, producer, region, country } = data;
  const origin: ReactNode[] = [
    producer && (
      <Link key="produtor" href={`/produtores/${producer.slug}`} className={linkClass}>
        {producer.name}
      </Link>
    ),
    region && (
      <Link key="regiao" href={`/regioes/${region.slug}`} className={linkClass}>
        {region.name}
      </Link>
    ),
    country && (
      <Link key="pais" href={`/paises/${country.slug}`} className={linkClass}>
        {country.name}
      </Link>
    ),
  ].filter(Boolean);
  // Poucos dados verificados: avisa em vez de parecer uma página quebrada
  const isSparse = data.vintages.length === 0 && !wine.grapes && !wine.productionMethod;

  return (
    <header className="grid gap-4">
      {wine.isDemo && <DemoBadge className="justify-self-start" />}
      <h1 className="font-serif text-h1 text-balance">{wine.name}</h1>
      {origin.length > 0 && (
        <p className="text-lead text-text-muted">
          {origin.map((item, index) => (
            <Fragment key={index}>
              {index > 0 && <span aria-hidden> · </span>}
              {item}
            </Fragment>
          ))}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Badge>{WINE_TYPE_LABELS[wine.type.value]}</Badge>
        {wine.sparklingSweetness && (
          <Badge>{SPARKLING_SWEETNESS_LABELS[wine.sparklingSweetness.value]}</Badge>
        )}
        {wine.isNonVintage?.value && <Badge>Multissafra</Badge>}
      </div>
      {wine.summary && (
        <p className="max-w-lead text-lead">
          {wine.summary.text}
          <Cite ids={wine.summary.basedOnSourceIds} numbers={numbers} />
        </p>
      )}
      {isSparse && <IncompleteDataNote subject="este vinho" />}
    </header>
  );
}
