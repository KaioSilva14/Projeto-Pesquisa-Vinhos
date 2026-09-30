import type { ReactNode } from "react";

import { Cite } from "@/components/sources/Cite";
import type { CitationNumbers } from "@/lib/wines/citations";

export type Fact = {
  label: string;
  value: ReactNode;
  /** Fontes do fato; viram o número da nota ao lado do valor. */
  sourceIds?: readonly string[] | undefined;
};

/** `false`/`undefined` = campo sem dado: simplesmente não aparece (RF10). */
export type MaybeFact = Fact | false | undefined;

export const presentFacts = (facts: readonly MaybeFact[]) =>
  facts.filter((fact): fact is Fact => Boolean(fact));

type FactListProps = {
  facts: readonly MaybeFact[];
  numbers: CitationNumbers;
};

/** Lista rótulo → valor (`dl`), cada valor com a sua fonte. */
export function FactList({ facts, numbers }: FactListProps) {
  const visible = presentFacts(facts);
  if (visible.length === 0) return null;

  return (
    <dl className="grid gap-3">
      {visible.map((fact) => (
        <div key={fact.label} className="grid gap-0.5">
          <dt className="text-small text-text-muted">{fact.label}</dt>
          <dd>
            {fact.value}
            <Cite ids={fact.sourceIds} numbers={numbers} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
