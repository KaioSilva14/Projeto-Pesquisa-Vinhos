import { z } from "zod";

import {
  coordinatesSchema,
  editorialTextSchema,
  entityBaseShape,
  geoSchema,
  idSchema,
  sourced,
  wikidataIdSchema,
} from "./common";

/** Country (DATA_MODEL.md §3.1). O id é o código ISO 3166-1 alfa-2 em minúsculas. */
export const countrySchema = z.strictObject({
  ...entityBaseShape,
  id: z.string().regex(/^[a-z]{2}$/, "Use o código ISO de 2 letras minúsculas (ex.: br)."),
  name: z.string().trim().min(2),
  summary: editorialTextSchema.optional(),
  wikidataId: wikidataIdSchema.optional(),
  geo: geoSchema.optional(),
});

export const regionLevels = ["region", "subregion", "appellation"] as const;

/** Region (DATA_MODEL.md §3.2): região → sub-região → denominação. */
export const regionSchema = z.strictObject({
  ...entityBaseShape,
  /** Nome oficial, no idioma original. */
  name: z.string().trim().min(2),
  /** Forma usual em português, se houver. */
  namePt: z.string().trim().min(2).optional(),
  countryId: idSchema,
  parentId: idSchema.optional(),
  level: z.enum(regionLevels),
  /** Ex.: sistema "DOP", categoria "DOCG". Só com fonte oficial. */
  appellation: sourced(
    z.strictObject({ system: z.string().min(1), category: z.string().min(1) }),
  ).optional(),
  summary: editorialTextSchema.optional(),
  history: editorialTextSchema.optional(),
  climate: sourced(z.string().min(1)).optional(),
  terroir: sourced(z.string().min(1)).optional(),
  mainGrapeIds: sourced(z.array(idSchema).nonempty()).optional(),
  mainStyleIds: sourced(z.array(idSchema).nonempty()).optional(),
  coordinates: sourced(coordinatesSchema).optional(),
  geo: geoSchema.optional(),
  wikidataId: wikidataIdSchema.optional(),
});

export type Country = z.infer<typeof countrySchema>;
export type Region = z.infer<typeof regionSchema>;
