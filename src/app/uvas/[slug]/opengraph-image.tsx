import { notFound } from "next/navigation";

import { OG_SIZE, renderOgCard } from "@/lib/seo/og-image";
import { catalogService } from "@/services";

// Imagem para redes sociais desta página (SEO.md §4): tipográfica, gerada no build.
export const alt = "Cartão do Vinum com o nome da uva.";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await catalogService.listGrapeSlugs()).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const data = await catalogService.getGrapePage((await params).slug);
  if (!data) notFound();
  return renderOgCard({ eyebrow: "Uva", title: data.grape.name });
}
