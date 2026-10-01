import type { EntityRef } from "@/lib/entity-list";
import type { PairingCategory } from "@/schemas/pairing";
import type { Source } from "@/schemas/source";

// Dados da página /harmonizacoes, montados em services/pairing-pages.ts.

/** Um vinho sugerido para o prato, com a fonte da sugestão (ficha do produtor). */
export type PairingSuggestion = EntityRef & { sourceIds: readonly string[] };

export type PairingItem = {
  slug: string;
  name: string;
  cuisine?: string;
  wines: PairingSuggestion[];
};

export type PairingGroup = {
  category: PairingCategory;
  label: string;
  pairings: PairingItem[];
};

export type PairingsPageData = {
  groups: PairingGroup[];
  /** Fontes citadas, na ordem em que aparecem na página. */
  sources: Source[];
};
