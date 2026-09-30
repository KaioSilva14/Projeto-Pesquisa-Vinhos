import { Fragment } from "react";

import type { CitationNumbers } from "@/lib/wines/citations";

type CiteProps = {
  ids: readonly string[] | undefined;
  numbers: CitationNumbers;
};

/** Número da fonte ao lado do fato ("14,2%¹"), com link para a lista "Fontes" da página. */
export function Cite({ ids, numbers }: CiteProps) {
  const cited = [...new Set(ids ?? [])].flatMap((id) => numbers[id] ?? []).sort((a, b) => a - b);
  if (cited.length === 0) return null;

  return (
    <sup className="text-caption">
      {cited.map((number, index) => (
        <Fragment key={number}>
          {index > 0 && ","}
          <a
            href={`#fonte-${number}`}
            aria-label={`Fonte ${number}`}
            // Área de toque de 24 px (WCAG 2.5.8), sem aumentar o número
            className="inline-block min-h-6 min-w-6 text-center leading-6 text-accent underline-offset-2 hover:underline"
          >
            {number}
          </a>
        </Fragment>
      ))}
    </sup>
  );
}
