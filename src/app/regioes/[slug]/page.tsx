import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LinkList } from "@/components/entity/LinkList";
import { ContentSection } from "@/components/layout/ContentSection";
import { EntityLayout } from "@/components/layout/EntityLayout";
import { EntityTitle } from "@/components/layout/EntityTitle";
import { EntityImage } from "@/components/media/EntityImage";
import { RegionFacts } from "@/components/place/RegionFacts";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cite } from "@/components/sources/Cite";
import { SourceList } from "@/components/sources/SourceList";
import { Badge } from "@/components/ui/Badge";
import { WineGrid } from "@/components/wine/WineGrid";
import { env } from "@/config/env";
import { numberCitations } from "@/lib/citations";
import { regionDescription, regionJsonLd } from "@/lib/seo/place";
import { catalogService } from "@/services";

type RegionPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await catalogService.listRegionSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const data = await catalogService.getRegionPage((await params).slug);
  if (!data) return {};
  const where = data.country ? `, ${data.country.name}` : "";
  const title = `${data.region.name}${where}: região vinícola`;
  const description = regionDescription(data);
  const path = `/regioes/${data.region.slug}`;
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
    ...(data.region.isDemo && { robots: { index: false, follow: false } }),
  };
}

export default async function RegionPage({ params }: RegionPageProps) {
  const data = await catalogService.getRegionPage((await params).slug);
  if (!data) notFound();

  const { region } = data;
  const numbers = numberCitations(data.sources.map((source) => source.id));
  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Regiões", href: "/regioes" },
    { label: region.name, href: `/regioes/${region.slug}` },
  ];

  return (
    <>
      <JsonLd data={regionJsonLd(data, breadcrumbs, env.NEXT_PUBLIC_SITE_URL)} />
      <EntityLayout
        breadcrumbs={breadcrumbs}
        media={
          <EntityImage
            image={data.image}
            variant="landscape"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
            showCredit
          />
        }
      >
        <header className="grid gap-4">
          <EntityTitle title={region.name} favorite={{ kind: "region", id: region.id }} />
          {region.appellation && (
            <Badge className="justify-self-start">{region.appellation.value.category}</Badge>
          )}
          {region.summary && (
            <p className="max-w-lead text-lead">
              {region.summary.text}
              <Cite ids={region.summary.basedOnSourceIds} numbers={numbers} />
            </p>
          )}
        </header>

        <ContentSection title="Ficha da região">
          <RegionFacts data={data} numbers={numbers} />
        </ContentSection>

        {data.children.length > 0 && (
          <ContentSection title="Sub-regiões e denominações">
            <p>
              <LinkList items={data.children} />
            </p>
          </ContentSection>
        )}

        {data.producers.length > 0 && (
          <ContentSection title="Produtores da região">
            <p>
              <LinkList items={data.producers} />
            </p>
          </ContentSection>
        )}

        <ContentSection title="Vinhos da região">
          {data.wines.length > 0 ? (
            <WineGrid wines={data.wines} headingLevel="h3" />
          ) : (
            <p className="text-text-muted">Ainda não há vinhos desta região no catálogo.</p>
          )}
        </ContentSection>

        <ContentSection title="Fontes" id="fontes">
          <SourceList sources={data.sources} correctionPath={`/regioes/${region.slug}`} />
        </ContentSection>
      </EntityLayout>
    </>
  );
}
