// Peças de SEO comuns às páginas de entidade (SEO.md §2 e §6).

export type BreadcrumbItem = { label: string; href: string };

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

/** Corta o texto no fim de uma palavra, com "…", para caber na descrição (~160 caracteres). */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.]$/, "")}…`;
}
