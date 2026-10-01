"use client";

// Client Component: os favoritos estão no navegador; o servidor só manda o catálogo resumido.

import Link from "next/link";

import { EntityGrid } from "@/components/entity/EntityGrid";
import { EmptyState } from "@/components/states/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { WineGrid } from "@/components/wine/WineGrid";
import type { EntityListItem } from "@/lib/entity-list";
import type { FavoriteKind } from "@/lib/favorites/favorites";
import type { WineListItem } from "@/lib/wines/list-item";
import { useFavorites, useFavoritesHydrated } from "@/stores/favorites";

export type FavoritesCatalog = {
  wines: readonly WineListItem[];
  grapes: readonly EntityListItem[];
  regions: readonly EntityListItem[];
  producers: readonly EntityListItem[];
};

/** Itens do catálogo na ordem em que foram salvos (o mais recente primeiro). */
function pick<T extends { id: string }>(
  list: readonly T[],
  saved: readonly { kind: FavoriteKind; id: string }[],
  kind: FavoriteKind,
): T[] {
  // Id que não existe mais no catálogo é ignorado (TESTING.md §2)
  return saved
    .filter((item) => item.kind === kind)
    .flatMap((item) => list.find((entry) => entry.id === item.id) ?? []);
}

/** Lista de favoritos (F6-02), agrupada por tipo. */
export function FavoritesView({ catalog }: { catalog: FavoritesCatalog }) {
  const hydrated = useFavoritesHydrated();
  const saved = useFavorites((state) => state.items);

  if (!hydrated) {
    return (
      <div className="grid gap-4" aria-busy="true" aria-label="Carregando favoritos">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  const wines = pick(catalog.wines, saved, "wine");
  const groups = [
    {
      title: "Uvas",
      label: "Uvas favoritas",
      items: pick(catalog.grapes, saved, "grape"),
      kind: "grape",
      variant: "grape",
    },
    {
      title: "Regiões",
      label: "Regiões favoritas",
      items: pick(catalog.regions, saved, "region"),
      kind: "region",
      variant: "landscape",
    },
    {
      title: "Produtores",
      label: "Produtores favoritos",
      items: pick(catalog.producers, saved, "producer"),
      kind: "producer",
      variant: "producer",
    },
  ] as const;

  if (wines.length + groups.reduce((total, group) => total + group.items.length, 0) === 0) {
    return (
      <EmptyState
        icon={<HeartIcon aria-hidden weight="light" />}
        title="Nenhum favorito ainda"
        description="Toque no coração de um vinho, uva, região ou produtor para guardar aqui."
        action={
          <Link href="/explorar" className={buttonVariants({ variant: "secondary" })}>
            Explorar o catálogo
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-12">
      {wines.length > 0 && (
        <section aria-labelledby="favoritos-vinhos" className="grid gap-4">
          <h2 id="favoritos-vinhos" className="font-serif text-h2">
            Vinhos
          </h2>
          <WineGrid wines={wines} label="Vinhos favoritos" headingLevel="h3" />
        </section>
      )}
      {groups.map(
        (group) =>
          group.items.length > 0 && (
            <section
              key={group.kind}
              aria-labelledby={`favoritos-${group.kind}`}
              className="grid gap-4"
            >
              <h2 id={`favoritos-${group.kind}`} className="font-serif text-h2">
                {group.title}
              </h2>
              <EntityGrid
                items={group.items}
                label={group.label}
                imageVariant={group.variant}
                headingLevel="h3"
                favoriteKind={group.kind}
              />
            </section>
          ),
      )}
    </div>
  );
}
