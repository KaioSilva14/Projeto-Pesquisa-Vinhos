import { z } from "zod";

import { httpsUrlSchema, idSchema, isoDateSchema } from "./common";

/** Hierarquia de confiabilidade em DATA_SOURCES.md §1. */
export const sourceKinds = [
  "producer",
  "winery",
  "official-distributor",
  "institution",
  "specialized-database",
  "technical",
  "other",
] as const;

export const sourceSchema = z.strictObject({
  id: idSchema.startsWith("src-", "O id de uma fonte começa com 'src-'."),
  kind: z.enum(sourceKinds),
  /** Ex.: "Ficha técnica oficial do produtor (safra 2021)". */
  label: z.string().trim().min(3),
  publisher: z.string().trim().min(1).optional(),
  url: httpsUrlSchema.optional(),
  accessedAt: isoDateSchema,
  reliability: z.enum(["primary", "secondary"]),
  /** Cópia arquivada (Wayback Machine), recomendada: fichas técnicas saem do ar. */
  archivedUrl: httpsUrlSchema.optional(),
  notes: z.string().min(1).optional(),
});

export type Source = z.infer<typeof sourceSchema>;
