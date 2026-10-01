import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntityGrid } from "@/components/entity/EntityGrid";
import { LinkList } from "@/components/entity/LinkList";
import { ContentSection } from "@/components/layout/ContentSection";
import { EntityLayout } from "@/components/layout/EntityLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Cite } from "@/components/sources/Cite";
import { PlaceMap } from "@/components/maps/PlaceMap";
import { SourceList } from "@/components/sources/SourceList";
import { IncompleteDataNote } from "@/components/states/IncompleteDataNote";
import { WineGrid } from "@/components/wine/WineGrid";
import { env } from "@/config/env";
import { numberCitations } from "@/lib/citations";
import { ofCountry } from "@/lib/places/grammar";
import { countryDescription, countryJsonLd } from "@/lib/seo/place";
import { catalogService } from "@/services";

type CountryPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await catalogService.listCountrySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const data = await catalogService.getCountryPage((await params).slug);
  if (!data) return {};
  const title = `Vinhos ${ofCountry(data.country)}`;
  const description = countryDescription(data);
  const path = `/paises/${data.country.slug}`;
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
    ...(data.country.isDemo && { robots: { index: false, follow: false } }),
  };
}

/** País: por enquanto um ponto de partida para as regiões, produtores e vinhos (ADR-019). */
export default async function CountryPage({ params }: CountryPageProps) {
  const data = await catalogService.getCountryPage((await params).slug);
  if (!data) notFound();

  const { country } = data;
  const numbers = numberCitations(data.sources.map((source) => source.id));
  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Países", href: "/paises" },
    { label: country.name, href: `/paises/${country.slug}` },
  ];

  return (
    <>
      <JsonLd data={countryJsonLd(data, breadcrumbs, env.NEXT_PUBLIC_SITE_URL)} />
      <EntityLayout breadcrumbs={breadcrumbs}>
        <header className="grid gap-4">
          <h1 className="font-serif text-h1 text-balance">{country.name}</h1>
          {country.summary ? (
            <p className="max-w-lead text-lead">
              {country.summary.text}
              <Cite ids={country.summary.basedOnSourceIds} numbers={numbers} />
            </p>
          ) : (
            <IncompleteDataNote subject="este país" />
          )}
        </header>

        {data.regions.length > 0 && (
          <ContentSection title="Regiões">
            {data.mapPoints.length > 0 && (
              <>
                <PlaceMap
                  points={data.mapPoints}
                  label={`Mapa ${ofCountry(country)}, com um marcador por região: ${data.mapPoints.map((point) => point.name).join(", ")}`}
                />
                <p className="text-text-muted">
                  Cada marcador indica o lugar retratado na foto da região
                  <Cite
                    ids={data.mapPoints.flatMap((point) => point.sourceIds)}
                    numbers={numbers}
                  />
                  . São localizações aproximadas: os limites das denominações não estão desenhados.
                </p>
              </>
            )}
            <EntityGrid
              items={data.regions}
              label={`Regiões: ${country.name}`}
              imageVariant="landscape"
              headingLevel="h3"
            />
          </ContentSection>
        )}

        {data.producers.length > 0 && (
          <ContentSection title="Produtores">
            <p>
              <LinkList items={data.producers} />
            </p>
          </ContentSection>
        )}

        <ContentSection title={`Vinhos ${ofCountry(country)}`}>
          {data.wines.length > 0 ? (
            <WineGrid wines={data.wines} headingLevel="h3" />
          ) : (
            <p className="text-text-muted">Ainda não há vinhos deste país no catálogo.</p>
          )}
        </ContentSection>

        {data.sources.length > 0 && (
          <ContentSection title="Fontes" id="fontes">
            <SourceList sources={data.sources} correctionPath={`/paises/${country.slug}`} />
          </ContentSection>
        )}
      </EntityLayout>
    </>
  );
}
