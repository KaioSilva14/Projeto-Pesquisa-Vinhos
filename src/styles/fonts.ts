import { Hanken_Grotesk, Newsreader } from "next/font/google";

// next/font baixa as fontes no build e as serve do próprio site: sem requisição ao Google
// no navegador (privacidade) e sem "pulo" de layout na troca de fonte (CLS).
// As variáveis CSS abaixo são lidas por --font-serif e --font-sans em globals.css.

// Só o subconjunto "latin": cobre português, espanhol, francês e italiano (inclusive Œ, ñ e
// aspas tipográficas). Sem itálico, que o site não usa. Orçamento: PERFORMANCE.md §2.
export const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-newsreader",
});

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});
