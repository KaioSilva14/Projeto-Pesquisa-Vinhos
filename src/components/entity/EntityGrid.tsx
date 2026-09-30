import type { EntityListItem } from "@/lib/entity-list";

import { EntityCard } from "./EntityCard";

type EntityGridProps = {
  items: readonly EntityListItem[];
  /** Nome da lista para leitores de tela, ex.: "Lista de uvas". */
  label: string;
  imageVariant: "grape" | "landscape" | "producer";
  headingLevel?: "h2" | "h3";
};

/**
 * Grade de cards de uvas, regiões, países ou produtores. Se ao menos um tem foto, todos reservam
 * a área (grade alinhada, com "Imagem indisponível" nos que faltam); se nenhum tem, nenhum reserva.
 */
export function EntityGrid({ items, label, imageVariant, headingLevel = "h2" }: EntityGridProps) {
  const reserveImage = items.some((item) => item.image);

  return (
    <ul aria-label={label} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <EntityCard
            {...item}
            imageVariant={imageVariant}
            reserveImage={reserveImage}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
