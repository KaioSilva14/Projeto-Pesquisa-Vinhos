import { z } from "zod";

// Peças compartilhadas pelos schemas das entidades (DATA_MODEL.md §2).
// Todos os objetos usam z.strictObject: um campo com nome errado (ex.: "alchoolPercent")
// derruba a validação em vez de ser ignorado em silêncio.

/** Identificadores e slugs: minúsculas, números e hífens, sem acento (RULES.md §2.4). */
export const idSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use só minúsculas, números e hífens (ex.: pinot-noir).");

export const isoDateSchema = z.iso.date({ error: "Use a data no formato AAAA-MM-DD." });

export const httpsUrlSchema = z.url({
  protocol: /^https$/,
  error: "Use um link https.",
});

/** Pelo menos uma fonte: um fato sem fonte não existe (CLAUDE.md §2.1). */
export const sourceIdsSchema = z
  .array(idSchema)
  .nonempty("Informe pelo menos uma fonte (sourceIds).");

/** Valor com rastreabilidade: todo fato relevante aponta para as fontes que o confirmam. */
export function sourced<T extends z.ZodType>(value: T) {
  return z.strictObject({
    value,
    sourceIds: sourceIdsSchema,
    /** Ex.: divergência entre fontes (DATA_SOURCES.md §7). */
    notes: z.string().min(1).optional(),
  });
}

/** Texto próprio (resumo, história), sempre baseado em fontes e nunca copiado. */
export const editorialTextSchema = z.strictObject({
  text: z.string().trim().min(20, "Texto editorial muito curto."),
  basedOnSourceIds: sourceIdsSchema,
  writtenAt: isoDateSchema,
});

/** Referência a uma delimitação geográfica (fase 9). */
export const geoSchema = z.strictObject({
  geojsonPath: z.string().startsWith("/geo/"),
  sourceIds: sourceIdsSchema,
});

export const coordinatesSchema = z.strictObject({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  /** Que lugar o ponto marca (ex.: "Radda in Chianti"): o mapa diz isso em texto (fase 9). */
  place: z.string().trim().min(2),
});

export const wikidataIdSchema = z.string().regex(/^Q\d+$/, "Use o formato Q123.");

/** Campos comuns a todas as entidades publicáveis. */
export const entityBaseShape = {
  id: idSchema,
  slug: idSchema,
  /** Só em src/data/demo/, sempre com selo visível. */
  isDemo: z.literal(true).optional(),
  status: z.enum(["draft", "published"]),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  /** A primeira é a principal. */
  imageIds: z.array(idSchema).optional(),
  /** Fontes gerais da entidade, além das citadas em cada campo. */
  sourceIds: z.array(idSchema),
};

export const wineTypes = [
  "tinto",
  "branco",
  "rose",
  "espumante",
  "fortificado",
  "sobremesa",
  "laranja",
] as const;
export const wineTypeSchema = z.enum(wineTypes);

export type EditorialText = z.infer<typeof editorialTextSchema>;
export type WineType = z.infer<typeof wineTypeSchema>;
