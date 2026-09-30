import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { EntityImage } from "@/components/media/EntityImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cite } from "@/components/sources/Cite";
import { SourceList } from "@/components/sources/SourceList";
import { RelatedWines } from "@/components/wine/RelatedWines";
import { SensoryProfile } from "@/components/wine/SensoryProfile";
import { VintageList } from "@/components/wine/VintageList";
import { WineFactSheet } from "@/components/wine/WineFactSheet";
import { WineHeader } from "@/components/wine/WineHeader";
import { env } from "@/config/env";
import { formatList } from "@/lib/format";
import { wineDescription, wineJsonLd } from "@/lib/seo/wine";
import { numberCitations } from "@/lib/citations";
import { catalogService } from "@/services";

type WinePageProps = { params: Promise<{ slug: string }> };

// Uma página estática por vinho, gerada no build; endereço desconhecido → 404 (ARCHITECTURE.md §6)
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await catalogService.listWineSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WinePageProps): Promise<Metadata> {
  const data = await catalogService.getWinePage((await params).slug);
  if (!data) return {};
  const title = data.producer ? `${data.wine.name} (${data.producer.name})` : data.wine.name;
  const description = wineDescription(data);
  const path = `/vinhos/${data.wine.slug}`;
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
    // Dados de demonstração nunca vão para buscadores (SEO.md §2)
    ...(data.wine.isDemo && { robots: { index: false, follow: false } }),
  };
}

export default async function WinePage({ params }: WinePageProps) {
  const data = await catalogService.getWinePage((await params).slug);
  if (!data) notFound();

  const { wine } = data;
  const numbers = numberCitations(data.sources.map((source) => source.id));
  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Vinhos", href: "/vinhos" },
    { label: wine.name, href: `/vinhos/${wine.slug}` },
  ];
  const hasTasting = Boolean(wine.sensory || wine.aromaNotes || wine.flavorNotes);

  return (
    <>
      <JsonLd data={wineJsonLd(data, breadcrumbs, env.NEXT_PUBLIC_SITE_URL)} />
      <Container className="pt-6 md:pt-10">
        <Breadcrumbs items={breadcrumbs} />
      </Container>
      <Container className="grid gap-10 pt-6 pb-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* Foto real ou aviso honesto; fixa ao rolar no desktop, no topo no celular (DESIGN.md §8, §12) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <EntityImage
            image={data.image}
            variant="bottle"
            sizes="(min-width: 1024px) 40vw, 16rem"
            priority
            showCredit
            className="mx-auto w-full max-w-64 lg:max-w-none"
          />
        </div>

        <div className="grid min-w-0 content-start gap-14">
          <WineHeader data={data} numbers={numbers} />

          <ContentSection title="Ficha técnica">
            <WineFactSheet data={data} numbers={numbers} />
          </ContentSection>

          {hasTasting && (
            <ContentSection title="Perfil sensorial">
              <SensoryProfile profile={wine.sensory} numbers={numbers} />
              {wine.aromaNotes && (
                <p>
                  <span className="text-text-muted">Aromas: </span>
                  {formatList(wine.aromaNotes.value)}
                  <Cite ids={wine.aromaNotes.sourceIds} numbers={numbers} />
                </p>
              )}
              {wine.flavorNotes && (
                <p>
                  <span className="text-text-muted">Boca: </span>
                  {formatList(wine.flavorNotes.value)}
                  <Cite ids={wine.flavorNotes.sourceIds} numbers={numbers} />
                </p>
              )}
            </ContentSection>
          )}

          {data.vintages.length > 0 && (
            <ContentSection title={data.vintages.length === 1 ? "Safra" : "Safras"}>
              <VintageList vintages={data.vintages} grapes={data.grapes} numbers={numbers} />
            </ContentSection>
          )}

          {wine.history && (
            <ContentSection title="História">
              <p className="max-w-prose">
                {wine.history.text}
                <Cite ids={wine.history.basedOnSourceIds} numbers={numbers} />
              </p>
            </ContentSection>
          )}

          {data.related.length > 0 && (
            <ContentSection title="Continue explorando">
              <RelatedWines groups={data.related} />
            </ContentSection>
          )}

          <ContentSection title="Fontes" id="fontes">
            <SourceList sources={data.sources} />
          </ContentSection>
        </div>
      </Container>
    </>
  );
}
