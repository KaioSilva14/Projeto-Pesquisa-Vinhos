import Link from "next/link";

import { ExploreBand } from "@/components/home/ExploreBand";
import { GrapeStrip } from "@/components/home/GrapeStrip";
import { HomeHero } from "@/components/home/HomeHero";
import { ProducerIndex } from "@/components/home/ProducerIndex";
import { RegionShowcase } from "@/components/home/RegionShowcase";
import { Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { WineGrid } from "@/components/wine/WineGrid";
import { env } from "@/config/env";
import { truncate } from "@/lib/seo/common";
import { homeJsonLd } from "@/lib/seo/home";
import { sortWines } from "@/lib/wines/list-item";
import { catalogService } from "@/services";

/** Quantos vinhos aparecem em "Descubra um vinho" (os de safra mais recente). */
const FEATURED_WINES = 6;

// Home editorial (F5-01, DESIGN.md §8). Tudo vem dos dados publicados: nenhum texto sobre
// vinhos escrito aqui. "Estilos" e "Aprenda" ficam de fora até existirem dados com fonte.
export default async function HomePage() {
  const [grapes, regionGroups, { items: wines }, producers, countries] = await Promise.all([
    catalogService.getGrapeList(),
    catalogService.getRegionGroups(),
    catalogService.getWineList(),
    catalogService.getProducerList(),
    catalogService.getCountryList(),
  ]);
  const regions = regionGroups.flatMap((group) => group.regions);

  // Região em destaque: a com mais vinhos no catálogo (empate: ordem alfabética), com foto
  const featuredItem = [...regions]
    .filter((region) => region.image)
    .sort((a, b) => b.wineCount - a.wineCount || a.name.localeCompare(b.name, "pt-BR"))[0];
  const featuredPage = featuredItem
    ? await catalogService.getRegionPage(featuredItem.href.split("/").at(-1) ?? "")
    : undefined;

  return (
    <>
      <JsonLd data={homeJsonLd(env.NEXT_PUBLIC_SITE_URL)} />
      <HomeHero
        counts={[
          { label: "vinhos", count: wines.length, href: "/vinhos" },
          { label: "uvas", count: grapes.length, href: "/uvas" },
          { label: "regiões", count: regions.length, href: "/regioes" },
          { label: "países", count: countries.length, href: "/paises" },
          { label: "produtores", count: producers.length, href: "/produtores" },
        ]}
      />

      {grapes.length > 0 && <GrapeStrip grapes={grapes} />}

      {featuredItem && (
        <RegionShowcase
          groups={regionGroups}
          featured={{
            name: featuredItem.name,
            href: featuredItem.href,
            ...(featuredItem.image && { image: featuredItem.image }),
            ...(featuredPage?.region.summary && {
              summary: truncate(featuredPage.region.summary.text, 220),
            }),
          }}
        />
      )}

      {wines.length > 0 && (
        <Section
          title="Descubra um vinho"
          description="As safras mais recentes do catálogo, com ficha técnica e fontes."
          rhythm="editorial"
        >
          <WineGrid wines={sortWines(wines, "safra").slice(0, FEATURED_WINES)} headingLevel="h3" />
          <Link
            href="/vinhos"
            className="mt-6 inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
          >
            Ver todos os vinhos
          </Link>
        </Section>
      )}

      {producers.length > 0 && <ProducerIndex producers={producers} />}

      <ExploreBand />
    </>
  );
}
