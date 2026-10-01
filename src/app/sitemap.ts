import type { MetadataRoute } from "next";

import { env } from "@/config/env";
import { absoluteUrl } from "@/lib/seo/common";
import { catalogService } from "@/services";

/**
 * Páginas fixas indexáveis (SEO.md §5). Ficam de fora: pesquisa e filtros (variações de
 * listas), favoritos (pessoal), agradecimento (passagem) e /dev.
 */
const STATIC_SITEMAP_PATHS = [
  "/",
  "/vinhos",
  "/uvas",
  "/regioes",
  "/paises",
  "/produtores",
  "/harmonizacoes",
  "/explorar",
  "/sobre",
  "/sugerir-correcao",
  "/privacidade",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const entities = await catalogService.getEntitySitemapEntries();
  return [
    ...STATIC_SITEMAP_PATHS.map((path) => ({ url: absoluteUrl(path, siteUrl) })),
    ...entities.map((entry) => ({
      url: absoluteUrl(entry.path, siteUrl),
      lastModified: entry.lastModified,
    })),
  ];
}
