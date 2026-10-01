import "server-only";

import type { DataAdapter } from "@/adapters/types";
import type { ImageCreditGroup, ImageCreditItem } from "@/lib/images/credits";
import type { ImageAsset } from "@/schemas/image-asset";

import { publishedOf, sortByName } from "./shared";

type EntityName = { id: string; slug: string; name: string };

const GROUPS = [
  { subjectType: "grape", title: "Uvas", collection: "grapes", path: "/uvas" },
  { subjectType: "region", title: "Regiões", collection: "regions", path: "/regioes" },
  { subjectType: "producer", title: "Produtores", collection: "producers", path: "/produtores" },
  { subjectType: "wine", title: "Vinhos", collection: "wines", path: "/vinhos" },
] as const;

/**
 * Todos os créditos de imagens (IMAGES.md §3: "/sobre#creditos lista todos os créditos"), lidos
 * dos próprios dados: a lista nunca fica desatualizada. Só fotos de entidades publicadas.
 */
export function createImageCreditsService(adapter: DataAdapter) {
  async function getImageCredits(): Promise<ImageCreditGroup[]> {
    const images = await adapter.getAll("images");

    const groups = await Promise.all(
      GROUPS.map(async ({ subjectType, title, collection, path }) => {
        // Só o que o crédito precisa (as coleções têm tipos diferentes)
        const entities: EntityName[] = sortByName(
          (await publishedOf(adapter, collection)).map(({ id, slug, name }) => ({
            id,
            slug,
            name,
          })),
        );
        const items = entities.flatMap((entity): ImageCreditItem[] =>
          images
            .filter(
              (image: ImageAsset) =>
                image.subjectType === subjectType && image.subjectId === entity.id,
            )
            .map((image) => ({ image, subjectName: entity.name, href: `${path}/${entity.slug}` })),
        );
        return { title, items };
      }),
    );
    return groups.filter((group) => group.items.length > 0);
  }

  return { getImageCredits };
}
