import { formatList } from "@/lib/format";
import { ofCountry } from "@/lib/places/grammar";
import type { ProducerPageData } from "@/lib/producers/page-data";

import { absoluteUrl, breadcrumbJsonLd, truncate, type BreadcrumbItem } from "./common";

const regionNames = (data: ProducerPageData) => data.regions.map((region) => region.name);

/** Título (SEO.md §2): "{nome}: produtor em {região}". */
export function producerTitle(data: ProducerPageData): string {
  const names = regionNames(data);
  return names.length > 0
    ? `${data.producer.name}: produtor em ${formatList(names)}`
    : data.producer.name;
}

/** História própria truncada; sem ela, uma frase com o que a página mostra. */
export function producerDescription(data: ProducerPageData): string {
  if (data.producer.history) return truncate(data.producer.history.text);
  const names = regionNames(data);
  const where = [
    names.length > 0 && ` em ${formatList(names)}`,
    data.country && `, ${ofCountry(data.country)}`,
  ]
    .filter(Boolean)
    .join("");
  return `Produtor de vinhos${where}: ficha, vinhos do catálogo e fontes oficiais.`;
}

/** WebPage → Organization (o produtor), com o site oficial em `url` e `sameAs` (SEO.md §6). */
export function producerJsonLd(
  data: ProducerPageData,
  breadcrumbs: readonly BreadcrumbItem[],
  siteUrl: string,
): Record<string, unknown> {
  const { producer } = data;
  const pageUrl = absoluteUrl(`/produtores/${producer.slug}`, siteUrl);
  const website = producer.officialWebsite?.value;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: producer.name,
        description: producerDescription(data),
        inLanguage: "pt-BR",
        about: {
          "@type": "Organization",
          name: producer.name,
          ...(website && { url: website, sameAs: [website] }),
          ...(producer.foundedYear && { foundingDate: String(producer.foundedYear.value) }),
          ...(data.country && {
            address: {
              "@type": "PostalAddress",
              addressCountry: data.country.id.toUpperCase(),
              ...(producer.location?.value.city && {
                addressLocality: producer.location.value.city,
              }),
            },
          }),
        },
      },
      breadcrumbJsonLd(breadcrumbs, siteUrl),
    ],
  };
}
