import { formatList } from "@/lib/format";
import { type BreadcrumbItem, absoluteUrl, breadcrumbJsonLd } from "@/lib/seo/common";
import { WINE_TYPE_LABELS } from "@/lib/labels";
import type { WinePageData } from "@/lib/wines/page-data";

/** Nomes das uvas do rótulo ou, sem ele, da safra mais recente. */
export function wineGrapeNames({ wine, vintages, grapes }: WinePageData): string[] {
  const composition = wine.grapes ?? vintages.find((vintage) => vintage.grapes)?.grapes;
  return (composition?.value ?? []).flatMap((item) => grapes[item.grapeId]?.name ?? []);
}

/** Palavras genéricas no começo do nome do produtor ("Bodega Catena Zapata" → "Catena Zapata"). */
const GENERIC_PREFIX =
  /^(bodegas?|château|chateau|domaine|champagne|cantina|tenuta|vinícola|quinta|weingut)\s+/i;

/**
 * Título "{nome} ({produtor})" (SEO.md §2), sem repetir o produtor quando o nome do vinho já
 * começa com ele: "Catena Zapata Malbec Argentino", não "... (Bodega Catena Zapata)".
 */
export function wineTitle({ wine, producer }: Pick<WinePageData, "wine" | "producer">): string {
  if (!producer) return wine.name;
  const name = wine.name.toLocaleLowerCase("pt-BR");
  const repeats = [producer.name, producer.name.replace(GENERIC_PREFIX, "")].some((candidate) =>
    name.startsWith(candidate.toLocaleLowerCase("pt-BR")),
  );
  return repeats ? wine.name : `${wine.name} (${producer.name})`;
}

/**
 * Descrição para buscadores (SEO.md §2): "Tinto de Bordeaux, França, elaborado com Merlot e
 * Cabernet Sauvignon. Ficha técnica e fontes oficiais." Só com as partes que existem.
 */
export function wineDescription(data: WinePageData): string {
  const place = [data.region?.name, data.country?.name].filter(Boolean).join(", ");
  const grapes = wineGrapeNames(data);
  return [
    WINE_TYPE_LABELS[data.wine.type.value],
    place && ` de ${place}`,
    grapes.length > 0 && `, elaborado com ${formatList(grapes)}`,
    ". Ficha técnica e fontes oficiais.",
  ]
    .filter(Boolean)
    .join("");
}

/** WebPage → Product sem oferta, preço ou avaliação (o site não vende) + trilha. */
export function wineJsonLd(
  data: WinePageData,
  breadcrumbs: readonly BreadcrumbItem[],
  siteUrl: string,
): Record<string, unknown> {
  const url = (path: string) => absoluteUrl(path, siteUrl);
  const pageUrl = url(`/vinhos/${data.wine.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: data.wine.name,
        description: wineDescription(data),
        inLanguage: "pt-BR",
        about: {
          "@type": "Product",
          name: data.wine.name,
          category: WINE_TYPE_LABELS[data.wine.type.value],
          ...(data.producer && { brand: { "@type": "Brand", name: data.producer.name } }),
          ...(data.country && {
            countryOfOrigin: { "@type": "Country", name: data.country.name },
          }),
          ...(data.image && { image: url(data.image.src) }),
        },
      },
      breadcrumbJsonLd(breadcrumbs, siteUrl),
    ],
  };
}
