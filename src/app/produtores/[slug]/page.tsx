import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentSection } from "@/components/layout/ContentSection";
import { EntityLayout } from "@/components/layout/EntityLayout";
import { EntityTitle } from "@/components/layout/EntityTitle";
import { EntityImage } from "@/components/media/EntityImage";
import { ProducerFacts } from "@/components/producer/ProducerFacts";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cite } from "@/components/sources/Cite";
import { SourceList } from "@/components/sources/SourceList";
import { IncompleteDataNote } from "@/components/states/IncompleteDataNote";
import { WineGrid } from "@/components/wine/WineGrid";
import { env } from "@/config/env";
import { numberCitations } from "@/lib/citations";
import { producerDescription, producerJsonLd, producerTitle } from "@/lib/seo/producer";
import { catalogService } from "@/services";

type ProducerPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await catalogService.listProducerSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProducerPageProps): Promise<Metadata> {
  const data = await catalogService.getProducerPage((await params).slug);
  if (!data) return {};
  const title = producerTitle(data);
  const description = producerDescription(data);
  const path = `/produtores/${data.producer.slug}`;
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
    ...(data.producer.isDemo && { robots: { index: false, follow: false } }),
  };
}

export default async function ProducerPage({ params }: ProducerPageProps) {
  const data = await catalogService.getProducerPage((await params).slug);
  if (!data) notFound();

  const { producer } = data;
  const numbers = numberCitations(data.sources.map((source) => source.id));
  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Produtores", href: "/produtores" },
    { label: producer.name, href: `/produtores/${producer.slug}` },
  ];

  return (
    <>
      <JsonLd data={producerJsonLd(data, breadcrumbs, env.NEXT_PUBLIC_SITE_URL)} />
      <EntityLayout
        breadcrumbs={breadcrumbs}
        media={
          <EntityImage
            image={data.image}
            variant="producer"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
            showCredit
          />
        }
      >
        <header className="grid gap-4">
          <EntityTitle title={producer.name} favorite={{ kind: "producer", id: producer.id }} />
          {!producer.history && <IncompleteDataNote subject="este produtor" />}
        </header>

        <ContentSection title="Ficha do produtor">
          <ProducerFacts data={data} numbers={numbers} />
        </ContentSection>

        {producer.history && (
          <ContentSection title="História">
            <p className="max-w-prose">
              {producer.history.text}
              <Cite ids={producer.history.basedOnSourceIds} numbers={numbers} />
            </p>
          </ContentSection>
        )}

        <ContentSection title="Vinhos do produtor">
          {data.wines.length > 0 ? (
            <WineGrid wines={data.wines} headingLevel="h3" />
          ) : (
            <p className="text-text-muted">Ainda não há vinhos deste produtor no catálogo.</p>
          )}
        </ContentSection>

        <ContentSection title="Fontes" id="fontes">
          <SourceList sources={data.sources} correctionPath={`/produtores/${producer.slug}`} />
        </ContentSection>
      </EntityLayout>
    </>
  );
}
