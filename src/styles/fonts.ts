import { Hanken_Grotesk, Newsreader } from "next/font/google";

// next/font baixa as fontes no build e as serve do próprio site: sem requisição ao Google
// no navegador (privacidade) e sem "pulo" de layout na troca de fonte (CLS).
// As variáveis CSS abaixo são lidas por --font-serif e --font-sans em globals.css.

export const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  // Eixo de tamanho óptico: o desenho se ajusta sozinho a títulos grandes e textos pequenos
  axes: ["opsz"],
  display: "swap",
  variable: "--font-newsreader",
});

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-hanken",
});
