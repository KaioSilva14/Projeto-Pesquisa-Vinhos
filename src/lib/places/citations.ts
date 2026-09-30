import { citationIds } from "@/lib/citations";
import type { Country, Region } from "@/schemas/geography";

/** Fontes citadas pela página da região, na ordem das seções (igual à da tela). */
export const regionCitationIds = (region: Region) =>
  citationIds([
    region.summary,
    { sourceIds: region.sourceIds },
    region.appellation,
    region.climate,
    region.terroir,
    region.mainGrapeIds,
    region.history,
  ]);

export const countryCitationIds = (country: Country) =>
  citationIds([country.summary, { sourceIds: country.sourceIds }]);
