import { z } from "zod";

import {
  editorialTextSchema,
  entityBaseShape,
  idSchema,
  sourced,
  wikidataIdSchema,
} from "./common";

export const grapeColors = ["tinta", "branca", "rosada", "cinza"] as const;

/** Grape (DATA_MODEL.md §3.3). O VIVC é a referência para nome, cor e sinônimos. */
export const grapeSchema = z.strictObject({
  ...entityBaseShape,
  /** Nome usado no site (uso no Brasil). */
  name: z.string().trim().min(2),
  /** Nome principal no VIVC (ex.: "COT" para a Malbec). */
  referenceName: sourced(z.string().min(2)).optional(),
  vivcId: z.string().regex(/^\d+$/, "O número do VIVC tem só dígitos.").optional(),
  synonyms: sourced(z.array(z.string().min(1)).nonempty()).optional(),
  color: sourced(z.enum(grapeColors)).optional(),
  /** Origem conhecida ou provável, com a nuance da fonte. */
  origin: sourced(z.string().min(2)).optional(),
  /** Só se confirmado por estudo genético citado. */
  parentage: sourced(z.string().min(3)).optional(),
  mainRegionIds: sourced(z.array(idSchema).nonempty()).optional(),
  characteristics: sourced(z.string().min(1)).optional(),
  aromaProfile: sourced(z.array(z.string().min(1)).nonempty()).optional(),
  flavorProfile: sourced(z.array(z.string().min(1)).nonempty()).optional(),
  styleIds: sourced(z.array(idSchema).nonempty()).optional(),
  summary: editorialTextSchema.optional(),
  wikidataId: wikidataIdSchema.optional(),
});

export type Grape = z.infer<typeof grapeSchema>;
export type GrapeColor = (typeof grapeColors)[number];
