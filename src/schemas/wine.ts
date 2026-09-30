import { z } from "zod";

import {
  editorialTextSchema,
  entityBaseShape,
  httpsUrlSchema,
  idSchema,
  sourceIdsSchema,
  sourced,
  wineTypeSchema,
} from "./common";

/** Estilo de vinho (DATA_MODEL.md §3.6). */
export const wineStyleSchema = z.strictObject({
  ...entityBaseShape,
  name: z.string().trim().min(2),
  type: wineTypeSchema,
  description: editorialTextSchema.optional(),
});

/** Uma uva na composição (DATA_MODEL.md §3.8). Percentual só se a fonte informar. */
export const wineGrapeSchema = z.strictObject({
  grapeId: idSchema,
  percentage: z.number().gt(0).max(100).optional(),
  /** Só se a fonte indicar "principal"/"majoritária" ou o percentual for o maior. */
  isMain: z.boolean().optional(),
});

/** Soma dos percentuais informados (uvas sem percentual não contam). */
function totalPercentage(grapes: readonly { percentage?: number | undefined }[]) {
  return grapes.reduce((sum, grape) => sum + (grape.percentage ?? 0), 0);
}

/** Composição de uvas: sem uvas repetidas; soma dos percentuais ≤ 101 (arredondamento). */
export const wineGrapesSchema = z
  .array(wineGrapeSchema)
  .nonempty()
  .superRefine((grapes, ctx) => {
    const ids = grapes.map((grape) => grape.grapeId);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: "custom", message: "A mesma uva aparece duas vezes na composição." });
    }
    const total = totalPercentage(grapes);
    if (total > 101) {
      ctx.addIssue({ code: "custom", message: `Percentuais somam ${total}%, acima de 100%.` });
    }
  });

/**
 * Composição com fonte. Quando todas as uvas têm percentual e a soma fica abaixo de 99%, a nota
 * é obrigatória e deve explicar o que falta (ex.: "4% de Petit Verdot, uva fora do catálogo").
 * Sem nota, uma soma baixa é tratada como erro de digitação.
 */
export const sourcedWineGrapesSchema = sourced(wineGrapesSchema).superRefine((grapes, ctx) => {
  const allHavePercentage = grapes.value.every((grape) => grape.percentage !== undefined);
  const total = totalPercentage(grapes.value);
  if (allHavePercentage && total < 99 && !grapes.notes) {
    ctx.addIssue({
      code: "custom",
      path: ["notes"],
      message: `Percentuais somam ${total}%: explique na nota o que completa os 100% (ex.: uva fora do catálogo).`,
    });
  }
});

/** Atributo sensorial: o nível só existe com o termo exato usado pela fonte (§5). */
export const sensoryAttributeSchema = z.strictObject({
  level: z.int().min(1).max(5),
  sourceTerm: z.string().trim().min(1),
  sourceIds: sourceIdsSchema,
});

export const sensoryProfileSchema = z.strictObject({
  body: sensoryAttributeSchema.optional(),
  acidity: sensoryAttributeSchema.optional(),
  tannins: sensoryAttributeSchema.optional(),
  sweetness: sensoryAttributeSchema.optional(),
  aromaIntensity: sensoryAttributeSchema.optional(),
});

export const productionTags = ["organico", "biodinamico", "natural", "vegano"] as const;

/** Wine: o rótulo, estável ao longo das safras (DATA_MODEL.md §3.7). */
export const wineSchema = z.strictObject({
  ...entityBaseShape,
  /** Nome do rótulo como o produtor usa. */
  name: z.string().trim().min(2),
  producerId: idSchema,
  wineryId: idSchema.optional(),
  countryId: idSchema,
  /** Região ou denominação mais específica confirmada. */
  regionId: idSchema.optional(),
  type: sourced(wineTypeSchema),
  styleId: idSchema.optional(),
  isNonVintage: sourced(z.boolean()).optional(),
  /** Composição típica, quando não varia por safra. */
  grapes: sourcedWineGrapesSchema.optional(),
  productionMethod: sourced(z.string().min(1)).optional(),
  /** Só com certificação ou declaração oficial. */
  productionTags: sourced(z.array(z.enum(productionTags)).nonempty()).optional(),
  summary: editorialTextSchema.optional(),
  history: editorialTextSchema.optional(),
  sensory: sensoryProfileSchema.optional(),
  aromaNotes: sourced(z.array(z.string().min(1)).nonempty()).optional(),
  flavorNotes: sourced(z.array(z.string().min(1)).nonempty()).optional(),
  servingTemperature: sourced(
    z
      .strictObject({ minC: z.number().min(0).max(25), maxC: z.number().min(0).max(25) })
      .refine((range) => range.minC <= range.maxC, "A temperatura mínima passa da máxima."),
  ).optional(),
  /** Texto da fonte, ex.: "até 10 anos". Só com fonte confiável. */
  agingPotential: sourced(z.string().min(1)).optional(),
  pairingIds: sourced(z.array(idSchema).nonempty()).optional(),
  volumeMl: sourced(z.array(z.int().positive()).nonempty()).optional(),
  officialPageUrl: sourced(httpsUrlSchema).optional(),
});

export type WineStyle = z.infer<typeof wineStyleSchema>;
export type WineGrape = z.infer<typeof wineGrapeSchema>;
export type SensoryAttribute = z.infer<typeof sensoryAttributeSchema>;
export type SensoryProfile = z.infer<typeof sensoryProfileSchema>;
export type Wine = z.infer<typeof wineSchema>;
