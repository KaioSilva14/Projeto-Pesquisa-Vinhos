import type { EntityListItem } from "@/lib/entity-list";
import type { FavoriteKind } from "@/lib/favorites/favorites";

import { EntityCard } from "./EntityCard";

type EntityGridProps = {
  items: readonly EntityListItem[];
  /** Nome da lista para leitores de tela, ex.: "Lista de uvas". */
  label: string;
  imageVariant: "grape" | "landscape" | "producer";
  headingLevel?: "h2" | "h3";
  /** Tipo da entidade, para o botão de favorito em cada card (sem ele, não há botão). */
  favoriteKind?: FavoriteKind;
  /** Lista no topo da página: a 1ª foto carrega com prioridade (é o maior elemento, LCP). */
  priorityFirst?: boolean;
};

/**
 * Grade de cards de uvas, regiões, países ou produtores. Se ao menos um tem foto, todos reservam
 * a área (grade alinhada, com "Imagem indisponível" nos que faltam); se nenhum tem, nenhum reserva.
 */
export function EntityGrid({
  items,
  label,
  imageVariant,
  headingLevel = "h2",
  favoriteKind,
  priorityFirst = false,
}: EntityGridProps) {
  const reserveImage = items.some((item) => item.image);

  return (
    <ul aria-label={label} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item, index) => (
        <li key={item.id}>
          <EntityCard
            {...item}
            priority={priorityFirst && index === 0}
            imageVariant={imageVariant}
            reserveImage={reserveImage}
            headingLevel={headingLevel}
            favorite={favoriteKind && { kind: favoriteKind, id: item.id }}
          />
        </li>
      ))}
    </ul>
  );
}
