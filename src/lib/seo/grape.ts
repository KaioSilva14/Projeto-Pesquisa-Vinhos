import type { GrapePageData } from "@/lib/grapes/page-data";
import { GRAPE_COLOR_LABELS } from "@/lib/labels";

import { absoluteUrl, breadcrumbJsonLd, truncate, type BreadcrumbItem } from "./common";

/** Resumo próprio truncado (SEO.md §2); sem resumo, uma frase com a cor e a origem. */
export function grapeDescription({ grape }: GrapePageData): string {
  if (grape.summary) return truncate(grape.summary.text);
  const color = grape.color ? GRAPE_COLOR_LABELS[grape.color.value] : "Uva";
  const origin = grape.origin ? ` (origem: ${grape.origin.value})` : "";
  return `${color}${origin}. Ficha, regiões e vinhos, com fontes.`;
}

/** Página educativa da uva: Article (autor: o Vinum) + trilha (SEO.md §6). */
export function grapeJsonLd(
  data: GrapePageData,
  breadcrumbs: readonly BreadcrumbItem[],
  siteUrl: string,
): Record<string, unknown> {
  const pageUrl = absoluteUrl(`/uvas/${data.grape.slug}`, siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": pageUrl,
        url: pageUrl,
        headline: data.grape.name,
        description: grapeDescription(data),
        inLanguage: "pt-BR",
        datePublished: data.grape.createdAt,
        dateModified: data.grape.updatedAt,
        author: { "@type": "Organization", name: "Vinum", url: absoluteUrl("/", siteUrl) },
        ...(data.image && { image: absoluteUrl(data.image.src, siteUrl) }),
      },
      breadcrumbJsonLd(breadcrumbs, siteUrl),
    ],
  };
}
