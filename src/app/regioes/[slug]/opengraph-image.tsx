import { notFound } from "next/navigation";

import { OG_SIZE, renderOgCard } from "@/lib/seo/og-image";
import { catalogService } from "@/services";

// Imagem para redes sociais desta página (SEO.md §4): tipográfica, gerada no build.
export const alt = "Cartão do Vinum com o nome da região e o país.";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await catalogService.listRegionSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const data = await catalogService.getRegionPage((await params).slug);
  if (!data) notFound();
  return renderOgCard({
    eyebrow: "Região vinícola",
    title: data.region.name,
    ...(data.country && { subtitle: data.country.name }),
  });
}
