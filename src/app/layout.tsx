import type { Metadata } from "next";
import type { ReactNode } from "react";

import { hankenGrotesk, newsreader } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
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
