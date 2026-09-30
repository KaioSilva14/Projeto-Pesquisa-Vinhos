import type { Vintage } from "@/schemas/vintage";
import type { Wine } from "@/schemas/wine";

import { citationIds, type Cited } from "@/lib/citations";

/** Fontes citadas pela página, sem repetir, na ordem das seções (igual à da tela). */
export function wineCitationIds(wine: Wine, vintages: readonly Vintage[]): string[] {
  const sensory = wine.sensory ?? {};
  const cited: (Cited | undefined)[] = [
    wine.summary,
    { sourceIds: wine.sourceIds }, // produtor, região e país do vinho
    wine.type,
    wine.sparklingSweetness,
    wine.isNonVintage,
    wine.officialPageUrl,
    wine.grapes,
    wine.productionMethod,
    wine.servingTemperature,
    wine.volumeMl,
    wine.agingPotential,
    sensory.body,
    sensory.acidity,
    sensory.tannins,
    sensory.sweetness,
    sensory.aromaIntensity,
    wine.aromaNotes,
    wine.flavorNotes,
    ...vintages.flatMap((vintage) => [
      vintage.alcoholPercent,
      vintage.grapes,
      vintage.residualSugarGL,
      vintage.totalAcidityGL,
      vintage.ph,
      vintage.aging,
      vintage.technicalSheetUrl,
    ]),
    wine.history,
  ];
  return citationIds(cited);
}
