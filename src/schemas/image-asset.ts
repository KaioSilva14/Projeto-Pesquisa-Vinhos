import { z } from "zod";

// ImageAsset (DATA_MODEL.md §3.11, IMAGES.md). Criado na F1-16 porque os componentes de mídia
// dependem dele; os demais schemas de entidades entram na F2-01.

const isoDate = z.iso.date({ error: "Use a data no formato AAAA-MM-DD." });
const httpsUrl = z.url({ protocol: /^https$/, error: "A origem precisa ser um link https." });

export const imageSubjectTypes = [
  "wine",
  "producer",
  "winery",
  "region",
  "grape",
  "ambient",
] as const;

export const imageAssetSchema = z
  .object({
    id: z.string().min(1),
    // Arquivo local em public/images (sem hotlink): IMAGES.md §7
    src: z.string().startsWith("/images/", "A imagem precisa estar em public/images/."),
    alt: z.string().trim().min(10, "Escreva um texto alternativo descritivo."),
    width: z.int().positive(),
    height: z.int().positive(),
    credit: z.string().trim().min(1),
    license: z.string().trim().min(1),
    licenseUrl: httpsUrl.optional(),
    sourceUrl: httpsUrl,
    subjectType: z.enum(imageSubjectTypes),
    subjectId: z.string().min(1).optional(),
    isIllustrative: z.literal(true).optional(),
    focalPoint: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
    blurDataURL: z.string().startsWith("data:image/").optional(),
    authorizationRef: z.string().min(1).optional(),
    modified: z.string().min(1).optional(),
    accessedAt: isoDate,
  })
  // Foto de uma entidade específica precisa dizer de qual entidade é
  .refine((image) => image.subjectType === "ambient" || image.subjectId, {
    message: "subjectId é obrigatório para imagens de uma entidade específica.",
    path: ["subjectId"],
  })
  // Imagem genérica (ambiente) nunca representa uma entidade e é sempre rotulada como ilustrativa
  .refine(
    (image) =>
      image.subjectType !== "ambient" || (image.isIllustrative && image.subjectId === undefined),
    {
      message: "Imagens 'ambient' precisam de isIllustrative: true e não podem ter subjectId.",
      path: ["isIllustrative"],
    },
  );

export type ImageAsset = z.infer<typeof imageAssetSchema>;
