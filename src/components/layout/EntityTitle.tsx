import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import type { FavoriteKind } from "@/lib/favorites/favorites";

type EntityTitleProps = {
  title: string;
  /** Entidade que o botão de favorito salva. */
  favorite: { kind: FavoriteKind; id: string };
};

/** Título (<h1>) das páginas de entidade, com o botão de favorito ao lado. */
export function EntityTitle({ title, favorite }: EntityTitleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <h1 className="font-serif text-h1 text-balance">{title}</h1>
      <FavoriteButton kind={favorite.kind} id={favorite.id} name={title} className="mt-1" />
    </div>
  );
}
