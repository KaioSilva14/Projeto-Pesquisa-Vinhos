import type { MetadataRoute } from "next";

import { env } from "@/config/env";
import { absoluteUrl } from "@/lib/seo/common";

/**
 * robots.txt (SEO.md §5). Em preview da Vercel, nada é indexado: o site de testes não pode
 * concorrer com o oficial nos buscadores.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  if (env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/pesquisa", "/favoritos", "/sugerir-correcao/obrigado", "/api/", "/dev/"],
    },
    sitemap: absoluteUrl("/sitemap.xml", siteUrl),
  };
}
