import { z } from "zod";

import {
  editorialTextSchema,
  entityBaseShape,
  httpsUrlSchema,
  idSchema,
  sourced,
  wikidataIdSchema,
} from "./common";

const locationSchema = z.strictObject({
  city: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

/** Producer (DATA_MODEL.md §3.4). */
export const producerSchema = z.strictObject({
  ...entityBaseShape,
  name: z.string().trim().min(2),
  countryId: idSchema,
  regionIds: z.array(idSchema).optional(),
  officialWebsite: sourced(httpsUrlSchema).optional(),
  foundedYear: sourced(z.int().min(1000).max(new Date().getFullYear())).optional(),
  history: editorialTextSchema.optional(),
  location: sourced(locationSchema).optional(),
  /** Orgânico, biodinâmico… só com certificação citada. */
  certifications: sourced(z.array(z.string().min(1)).nonempty()).optional(),
  wikidataId: wikidataIdSchema.optional(),
});

/**
 * Winery: propriedade física (DATA_MODEL.md §3.5). Não criar quando for a mesma coisa que
 * o produtor nos dados.
 */
export const winerySchema = z.strictObject({
  ...entityBaseShape,
  name: z.string().trim().min(2),
  producerId: idSchema,
  regionId: idSchema.optional(),
  location: sourced(locationSchema).optional(),
  /** Só informação oficial, sem horários ou preços. */
  visitorInfo: sourced(z.string().min(1)).optional(),
  history: editorialTextSchema.optional(),
});

export type Producer = z.infer<typeof producerSchema>;
export type Winery = z.infer<typeof winerySchema>;
