import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/BottomNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/layout/SkipLink";
import { env } from "@/config/env";
import { SITE } from "@/config/site";
import { hankenGrotesk, newsreader } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  // Base para URLs absolutas de canonical e Open Graph (SEO.md)
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  // Cada página define só o próprio título; o modelo acrescenta o nome do site (SEO.md)
  title: { default: `${SITE.name}: pesquise e descubra vinhos`, template: `%s | ${SITE.name}` },
  description: SITE.description,
};

export const viewport: Viewport = {
  // Necessário para env(safe-area-inset-*) funcionar no iPhone (barra inferior)
  viewportFit: "cover",
  // Cor da barra do navegador no celular, igual ao fundo de cada tema (--color-bg)
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#141416" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <SiteHeader />
        {/* tabIndex -1: o SkipLink consegue mover o foco para cá */}
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
        <BottomNav />
      </body>
    </html>
  );
}
