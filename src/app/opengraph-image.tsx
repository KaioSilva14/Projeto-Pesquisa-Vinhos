import { OG_SIZE, renderOgCard } from "@/lib/seo/og-image";

// Imagem padrão para redes sociais (SEO.md §4): vale para as páginas sem imagem própria.
export const alt = "Cartão do Vinum: pesquise e descubra vinhos, com fontes verificadas.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    eyebrow: "Pesquisa e descoberta de vinhos",
    title: "Pesquise vinhos, uvas, regiões e produtores",
    subtitle: "Cada informação diz de onde veio.",
  });
}
