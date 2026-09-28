import { z } from "zod";

// Variáveis de ambiente validadas (SECURITY.md §5). Um valor inválido derruba o build com uma
// mensagem clara, em vez de virar um bug silencioso no site. Documentação em .env.example.

const booleanString = z
  .enum(["true", "false"], { error: 'Use "true" ou "false".' })
  .transform((value) => value === "true");

export const envSchema = z
  .object({
    NEXT_PUBLIC_SITE_URL: z
      .url({ protocol: /^https?$/, error: "Precisa ser uma URL http(s), sem barra no final." })
      .refine((url) => !url.endsWith("/"), "Remova a barra do final.")
      .default("http://localhost:3000"),
    NEXT_PUBLIC_ENABLE_DEMO_DATA: booleanString.default(false),
    /** Definida pela Vercel: "production", "preview" ou "development". */
    VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  })
  .refine((env) => !(env.VERCEL_ENV === "production" && env.NEXT_PUBLIC_ENABLE_DEMO_DATA), {
    message: "Dados de demonstração não podem ir para produção (RULES.md §1.1).",
    path: ["NEXT_PUBLIC_ENABLE_DEMO_DATA"],
  });

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Variáveis de ambiente inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Cada variável escrita por extenso: o Next só leva ao navegador as NEXT_PUBLIC_* que aparecem
// literalmente no código. Variável vazia conta como ausente (usa o padrão).
export const env = parseEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_ENABLE_DEMO_DATA: process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA || undefined,
  VERCEL_ENV: process.env.VERCEL_ENV || undefined,
});
