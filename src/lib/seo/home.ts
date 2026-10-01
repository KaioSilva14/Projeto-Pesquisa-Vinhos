import { SITE } from "@/config/site";

import { absoluteUrl } from "./common";

/**
 * Home (SEO.md §6): WebSite com a ação de busca (os buscadores podem oferecer a pesquisa do
 * Vinum direto nos resultados) e Organization (o próprio Vinum).
 */
export function homeJsonLd(siteUrl: string): Record<string, unknown> {
  const home = absoluteUrl("/", siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#site`,
        url: home,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "pt-BR",
        publisher: { "@id": `${home}#organizacao` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${absoluteUrl("/pesquisa", siteUrl)}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      { "@type": "Organization", "@id": `${home}#organizacao`, name: SITE.name, url: home },
    ],
  };
}
