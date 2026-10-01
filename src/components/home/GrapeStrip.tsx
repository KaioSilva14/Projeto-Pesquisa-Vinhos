import Link from "next/link";

import { EntityCard } from "@/components/entity/EntityCard";
import { Section } from "@/components/layout/Section";
import type { EntityListItem } from "@/lib/entity-list";

type GrapeStripProps = {
  grapes: readonly EntityListItem[];
};

/**
 * "Comece por uma uva": no celular, faixa horizontal que se arrasta com o dedo (rolagem com
 * encaixe, sem barra visível no toque). A partir do tablet, grade comum: com mouse, a rolagem
 * horizontal mostraria uma barra de rolagem no meio da página.
 */
export function GrapeStrip({ grapes }: GrapeStripProps) {
  return (
    <Section
      title="Comece por uma uva"
      description="Origem, outros nomes e os vinhos do catálogo feitos com cada uma."
      rhythm="editorial"
      className="bg-surface"
    >
      <ul
        aria-label="Uvas do catálogo"
        // Celular: encosta nas bordas da tela (mesmas margens do Container) para arrastar
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5"
      >
        {grapes.map((grape) => (
          <li key={grape.id} className="w-64 shrink-0 snap-start md:w-auto">
            <EntityCard {...grape} imageVariant="grape" headingLevel="h3" />
          </li>
        ))}
      </ul>
      <Link
        href="/uvas"
        className="mt-4 inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
      >
        Ver todas as uvas
      </Link>
    </Section>
  );
}
