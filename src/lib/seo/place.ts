import { ofCountry } from "@/lib/places/grammar";
import type { CountryPageData, RegionPageData } from "@/lib/places/page-data";

import { absoluteUrl, breadcrumbJsonLd, truncate, type BreadcrumbItem } from "./common";

/** Resumo próprio truncado; sem resumo, uma frase com o que a página mostra (SEO.md §2). */
export function regionDescription({ region, country }: RegionPageData): string {
  if (region.summary) return truncate(region.summary.text);
  const where = country ? ` ${ofCountry(country)}` : "";
  return `Região vinícola${where}: uvas principais, produtores e vinhos, com fontes.`;
}

export function countryDescription({ country, regions }: CountryPageData): string {
  if (country.summary) return truncate(country.summary.text);
  const names = regions.slice(0, 3).map((region) => region.name);
  const list = names.length > 0 ? ` (${names.join(", ")})` : "";
  return `Regiões${list}, produtores e vinhos ${ofCountry(country)} no catálogo do Vinum, com fontes.`;
}

/** WebPage → Place (região dentro do país) + trilha (SEO.md §6). */
export function regionJsonLd(
  data: RegionPageData,
  breadcrumbs: readonly BreadcrumbItem[],
  siteUrl: string,
): Record<string, unknown> {
  const pageUrl = absoluteUrl(`/regioes/${data.region.slug}`, siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: data.region.name,
        description: regionDescription(data),
        inLanguage: "pt-BR",
        about: {
          "@type": "Place",
          name: data.region.name,
          ...(data.country && {
            containedInPlace: { "@type": "Country", name: data.country.name },
          }),
        },
      },
      breadcrumbJsonLd(breadcrumbs, siteUrl),
    ],
  };
}

export function countryJsonLd(
  data: CountryPageData,
  breadcrumbs: readonly BreadcrumbItem[],
  siteUrl: string,
): Record<string, unknown> {
  const pageUrl = absoluteUrl(`/paises/${data.country.slug}`, siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `Vinhos ${ofCountry(data.country)}`,
        description: countryDescription(data),
        inLanguage: "pt-BR",
        about: { "@type": "Country", name: data.country.name },
      },
      breadcrumbJsonLd(breadcrumbs, siteUrl),
    ],
  };
}
