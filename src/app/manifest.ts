import type { MetadataRoute } from "next";

import { SITE } from "@/config/site";
import { BRAND } from "@/lib/seo/og-image";

/** Manifesto do app: nome, cores e ícones ao salvar o Vinum na tela inicial. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: pesquise e descubra vinhos`,
    short_name: SITE.name,
    description: SITE.description,
    lang: "pt-BR",
    start_url: "/",
    display: "standalone",
    background_color: BRAND.bg,
    theme_color: BRAND.bg,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icone-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
