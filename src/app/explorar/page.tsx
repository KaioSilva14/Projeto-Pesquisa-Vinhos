import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { FilterChipLink } from "@/components/ui/Chip";
import { FILTER_GROUPS, facetCounts, winesHref } from "@/lib/filters/wine-filters";
import { catalogService } from "@/services";

const DESCRIPTION =
  "Atalhos para o catálogo: escolha um tipo, país, região, uva ou produtor e veja os vinhos.";

export const metadata: Metadata = {
  title: "Explorar",
  description: DESCRIPTION,
  alternates: { canonical: "/explorar" },
};

const MORE = [
  { label: "Todas as uvas", href: "/uvas" },
  { label: "Todas as regiões", href: "/regioes" },
  { label: "Países", href: "/paises" },
  { label: "Produtores", href: "/produtores" },
  { label: "Harmonizações", href: "/harmonizacoes" },
] as const;

/**
 * Explorar (F5-03): cada opção leva à lista de vinhos já filtrada. As contagens usam as mesmas
 * funções dos filtros de /vinhos, então sempre batem com o que a lista mostra.
 */
export default async function ExplorePage() {
  const { items, options } = await catalogService.getWineList();

  return (
    <>
      <PageHeader
        title="Explorar"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Explorar", href: "/explorar" },
        ]}
      />
      <Container className="pb-16">
        <div className="grid max-w-4xl gap-12">
          {FILTER_GROUPS.map((group) => {
            const counts = facetCounts(items, {}, group.key);
            const available = options[group.key].filter((option) => counts.get(option.value));
            if (available.length === 0) return null;
            return (
              <ContentSection key={group.key} title={`Por ${group.label.toLowerCase()}`}>
                <ul className="flex flex-wrap gap-2">
                  {available.map((option) => (
                    <li key={option.value}>
                      <FilterChipLink
                        href={winesHref({ selection: { [group.key]: [option.value] } })}
                        selected={false}
                        count={counts.get(option.value) ?? 0}
                      >
                        {option.label}
                      </FilterChipLink>
                    </li>
                  ))}
                </ul>
              </ContentSection>
            );
          })}

          <ContentSection title="Mais caminhos">
            <ul className="flex flex-wrap gap-2">
              {MORE.map((link) => (
                <li key={link.href}>
                  <FilterChipLink href={link.href} selected={false}>
                    {link.label}
                  </FilterChipLink>
                </li>
              ))}
            </ul>
          </ContentSection>
        </div>
      </Container>
    </>
  );
}
