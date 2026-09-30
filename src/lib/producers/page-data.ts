import { citationIds } from "@/lib/citations";
import type { EntityRef } from "@/lib/entity-list";
import type { WineListItem } from "@/lib/wines/list-item";
import type { Country } from "@/schemas/geography";
import type { ImageAsset } from "@/schemas/image-asset";
import type { Producer } from "@/schemas/producer";
import type { Source } from "@/schemas/source";

// Dados das páginas /produtores e /produtores/[slug], montados em services/producer-pages.ts.

export type ProducerPageData = {
  producer: Producer;
  country?: Country;
  regions: EntityRef[];
  wines: WineListItem[];
  image?: ImageAsset;
  /** Fontes citadas, na ordem em que aparecem na página. */
  sources: Source[];
};

/** Fontes citadas pela página do produtor, na ordem das seções (igual à da tela). */
export const producerCitationIds = (producer: Producer) =>
  citationIds([
    { sourceIds: producer.sourceIds },
    producer.foundedYear,
    producer.location,
    producer.officialWebsite,
    producer.certifications,
    producer.history,
  ]);
