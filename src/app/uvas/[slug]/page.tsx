import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GrapeFacts } from "@/components/grape/GrapeFacts";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { EntityImage } from "@/components/media/EntityImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cite } from "@/components/sources/Cite";
import { SourceList } from "@/components/sources/SourceList";
import { Badge } from "@/components/ui/Badge";
import { WineCard } from "@/components/wine/WineCard";
import { env } from "@/config/env";
import { numberCitations } from "@/lib/citations";
import { GRAPE_COLOR_LABELS } from "@/lib/labels";
import { grapeDescription, grapeJsonLd } from "@/lib/seo/grape";
import { catalogService } from "@/services";

type GrapePageProps = { params: Promise<{ slug: string }> };

// Uma página estática por uva; endereço desconhecido → 404 (ARCHITECTURE.md §6)
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await catalogService.listGrapeSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GrapePageProps): Promise<Metadata> {
  const data = await catalogService.getGrapePage((await params).slug);
  if (!data) return {};
  const title = `${data.grape.name}: uva, origem e vinhos`;
  const description = grapeDescription(data);
  const path = `/uvas/${data.grape.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      siteName: "Vinum",
      locale: "pt_BR",
    },
    ...(data.grape.isDemo && { robots: { index: false, follow: false } }),
  };
}

export default async function GrapePage({ params }: GrapePageProps) {
  const data = await catalogService.getGrapePage((await params).slug);
  if (!data) notFound();

  const { grape } = data;
  const numbers = numberCitations(data.sources.map((source) => source.id));
  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Uvas", href: "/uvas" },
    { label: grape.name, href: `/uvas/${grape.slug}` },
  ];

  return (
    <>
      <JsonLd data={grapeJsonLd(data, breadcrumbs, env.NEXT_PUBLIC_SITE_URL)} />
      <Container className="pt-6 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </Container>
      <Container className="grid gap-10 pt-6 pb-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <EntityImage
            image={data.image}
            variant="grape"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
            showCredit
          />
        </div>

        <div className="grid min-w-0 content-start gap-14">
          <header className="grid gap-4">
            <h1 className="font-serif text-h1 text-balance">{grape.name}</h1>
            {grape.color && (
              <Badge className="justify-self-start">{GRAPE_COLOR_LABELS[grape.color.value]}</Badge>
            )}
            {grape.summary && (
              <p className="max-w-lead text-lead">
                {grape.summary.text}
                <Cite ids={grape.summary.basedOnSourceIds} numbers={numbers} />
              </p>
            )}
          </header>

          <ContentSection title="Ficha da uva">
            <GrapeFacts data={data} numbers={numbers} />
          </ContentSection>

          <ContentSection title="Vinhos com esta uva">
            {data.wines.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.wines.map((wine) => (
                  <li key={wine.id}>
                    <WineCard wine={wine} headingLevel="h3" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted">Ainda não há vinhos com esta uva no catálogo.</p>
            )}
          </ContentSection>

          <ContentSection title="Fontes" id="fontes">
            <SourceList sources={data.sources} />
          </ContentSection>
        </div>
      </Container>
    </>
  );
}
