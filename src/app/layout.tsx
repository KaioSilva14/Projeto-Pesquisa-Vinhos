import type { Metadata } from "next";
import type { ReactNode } from "react";

import { env } from "@/config/env";
import { hankenGrotesk, newsreader } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  // Base para URLs absolutas de canonical e Open Graph (SEO.md)
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Vinum",
  description: "Pesquisa, descoberta e consulta de vinhos, com fontes verificadas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
