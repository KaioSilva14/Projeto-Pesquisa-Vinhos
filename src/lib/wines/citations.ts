import type { Vintage } from "@/schemas/vintage";
import type { Wine } from "@/schemas/wine";

// Notas de fonte da página do vinho: cada fato mostra o número da fonte ("¹"), e a lista
// "Fontes" no fim segue a mesma numeração, na ordem em que as fontes aparecem na página.

type Cited =
  { readonly sourceIds: readonly string[] } | { readonly basedOnSourceIds: readonly string[] };

const idsOf = (item: Cited | undefined): readonly string[] =>
  !item ? [] : "sourceIds" in item ? item.sourceIds : item.basedOnSourceIds;

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
  return [...new Set(cited.flatMap(idsOf))];
}

export type CitationNumbers = Readonly<Record<string, number>>;

/** Número de cada fonte (1, 2, 3…) na ordem recebida. */
export function numberCitations(sourceIds: readonly string[]): CitationNumbers {
  return Object.fromEntries(sourceIds.map((id, index) => [id, index + 1]));
}
