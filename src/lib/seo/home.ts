import type { FaqItem } from "@/config/faq";
import { SITE } from "@/config/site";

import { absoluteUrl } from "./common";

/**
 * Home (SEO.md §6): WebSite com a ação de busca (os buscadores podem oferecer a pesquisa do
 * Vinum direto nos resultados), Organization (o próprio Vinum) e FAQPage (perguntas da home).
 */
export function homeJsonLd(siteUrl: string, faq: readonly FaqItem[] = []): Record<string, unknown> {
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
      // Perguntas frequentes da própria home (o mesmo texto que aparece na página)
      ...(faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${home}#perguntas`,
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };
}
