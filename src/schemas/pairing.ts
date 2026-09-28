import { z } from "zod";

import { editorialTextSchema, entityBaseShape, idSchema, sourced } from "./common";

export const pairingCategories = [
  "carnes",
  "aves",
  "peixes-e-frutos-do-mar",
  "massas",
  "queijos",
  "vegetarianos",
  "sobremesas",
  "culinarias",
] as const;

/** Pairing (DATA_MODEL.md §3.10): sempre orientação, nunca "a única combinação correta". */
export const pairingSchema = z.strictObject({
  ...entityBaseShape,
  category: z.enum(pairingCategories),
  /** Prato ou ingrediente, ex.: "Queijos de massa dura". */
  name: z.string().trim().min(2),
  cuisine: z.string().min(1).optional(),
  guidance: editorialTextSchema.optional(),
  relatedGrapeIds: sourced(z.array(idSchema).nonempty()).optional(),
  relatedStyleIds: sourced(z.array(idSchema).nonempty()).optional(),
});

export type Pairing = z.infer<typeof pairingSchema>;
