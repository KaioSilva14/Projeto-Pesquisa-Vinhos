import { citationIds } from "@/lib/citations";
import type { Grape } from "@/schemas/grape";

/** Fontes citadas pela página da uva, na ordem das seções (igual à da tela). */
export function grapeCitationIds(grape: Grape): string[] {
  return citationIds([
    grape.summary,
    { sourceIds: grape.sourceIds },
    grape.color,
    grape.origin,
    grape.parentage,
    grape.referenceName,
    grape.synonyms,
    grape.characteristics,
    grape.aromaProfile,
    grape.flavorProfile,
    grape.mainRegionIds,
  ]);
}
