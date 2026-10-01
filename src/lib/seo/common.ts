// Peças de SEO comuns às páginas de entidade (SEO.md §2 e §6).

export type BreadcrumbItem = { label: string; href: string };

/**
 * Limites de caracteres (SEO.md §2): acima disso, o Google corta o texto no resultado.
 * O título conta com o " | Vinum" que o modelo do layout acrescenta.
 */
export const SEO_LIMITS = { title: 60, description: 155 } as const;

export const absoluteUrl = (path: string, siteUrl: string) => new URL(path, siteUrl).toString();

/** Trilha de navegação para os buscadores (BreadcrumbList). */
export function breadcrumbJsonLd(items: readonly BreadcrumbItem[], siteUrl: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href, siteUrl),
    })),
  };
}

/** Corta o texto no fim de uma palavra, com "…", para caber na descrição. */
export function truncate(text: string, max: number = SEO_LIMITS.description): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}
