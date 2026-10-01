import Link from "next/link";

import { Section } from "@/components/layout/Section";
import type { EntityListItem } from "@/lib/entity-list";

type ProducerIndexProps = {
  producers: readonly EntityListItem[];
};

/** "Produtores": índice editorial só com texto, em colunas (DESIGN.md §8: outra família de layout). */
export function ProducerIndex({ producers }: ProducerIndexProps) {
  return (
    <Section
      title="Produtores"
      description="Vinícolas do catálogo, com dados das fichas técnicas e páginas oficiais."
      rhythm="editorial"
      className="bg-surface"
    >
      <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
        {producers.map((producer) => (
          <li key={producer.id} className="border-t border-border">
            <Link href={producer.href} className="group grid min-h-11 gap-0.5 py-4">
              <span className="font-serif text-h3 group-hover:text-accent">{producer.name}</span>
              {producer.context && (
                <span className="text-small text-text-muted">{producer.context}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
