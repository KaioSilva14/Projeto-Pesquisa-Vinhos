import { z } from "zod";

import { editorialTextSchema, httpsUrlSchema, idSchema, sourced } from "./common";
import { wineGrapesSchema } from "./wine";

/**
 * Vintage: dados que mudam a cada safra (DATA_MODEL.md §3.9).
 * Prêmios e notas de críticos ficam fora do modelo na v1.
 */
export const vintageSchema = z
  .strictObject({
    /** Formato {wineId}-{ano}. */
    id: idSchema,
    wineId: idSchema,
    year: z
      .int()
      .min(1800)
      .refine((year) => year <= new Date().getFullYear(), "A safra não pode ser no futuro."),
    isDemo: z.literal(true).optional(),
    /** Só confirmado em ficha técnica ou rótulo. */
    alcoholPercent: sourced(z.number().gt(0).max(25)).optional(),
    /** Composição desta safra; substitui a do vinho. */
    grapes: sourced(wineGrapesSchema).optional(),
    residualSugarGL: sourced(z.number().min(0).max(500)).optional(),
    totalAcidityGL: sourced(z.number().gt(0).max(20)).optional(),
    ph: sourced(z.number().gt(2).lt(5)).optional(),
    aging: sourced(z.string().min(1)).optional(),
    technicalSheetUrl: sourced(httpsUrlSchema).optional(),
    notes: editorialTextSchema.optional(),
  })
  .refine((vintage) => vintage.id === `${vintage.wineId}-${vintage.year}`, {
    message: "O id da safra deve ser {wineId}-{ano}.",
    path: ["id"],
  });

export type Vintage = z.infer<typeof vintageSchema>;
