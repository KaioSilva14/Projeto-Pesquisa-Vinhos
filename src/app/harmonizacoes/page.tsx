import type { Metadata } from "next";

import { LinkList } from "@/components/entity/LinkList";
import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { Cite } from "@/components/sources/Cite";
import { SourceList } from "@/components/sources/SourceList";
import { numberCitations } from "@/lib/citations";
import { catalogService } from "@/services";

const DESCRIPTION =
  "Pratos que os próprios produtores sugerem para os seus vinhos, com a fonte de cada sugestão. São orientações, não regras.";

export const metadata: Metadata = {
  title: "Harmonizações",
  description: DESCRIPTION,
  alternates: { canonical: "/harmonizacoes" },
};

/** Harmonizações (F4-06, PRD F06): sempre orientação, nunca "a única combinação correta". */
export default async function PairingsPage() {
  const { groups, sources } = await catalogService.getPairingsPage();
  const numbers = numberCitations(sources.map((source) => source.id));

  return (
    <>
      <PageHeader
        title="Harmonizações"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Harmonizações", href: "/harmonizacoes" },
        ]}
      >
        <p className="max-w-lead text-small text-text-muted">
          Só mostramos sugestões publicadas pelos produtores nas fichas técnicas e páginas oficiais.
          Vinhos cujas fontes não sugerem pratos não aparecem aqui. Outras combinações também podem
          funcionar.
        </p>
      </PageHeader>
      <Container className="pb-16">
        <div className="grid max-w-3xl gap-14">
          {groups.map((group) => (
            <ContentSection key={group.category} title={group.label}>
              <ul className="grid gap-6">
                {group.pairings.map((pairing) => (
                  <li key={pairing.slug} id={pairing.slug} className="grid scroll-mt-24 gap-1">
                    <h3 className="font-serif text-h4">{pairing.name}</h3>
                    {pairing.cuisine && pairing.cuisine !== pairing.name && (
                      <p className="text-small text-text-muted">{pairing.cuisine}</p>
                    )}
                    <p>
                      <span className="text-text-muted">Sugerido para: </span>
                      <LinkList items={pairing.wines} />
                      <Cite
                        ids={pairing.wines.flatMap((wine) => wine.sourceIds)}
                        numbers={numbers}
                      />
                    </p>
                  </li>
                ))}
              </ul>
            </ContentSection>
          ))}

          {sources.length > 0 && (
            <ContentSection title="Fontes" id="fontes">
              <SourceList sources={sources} correctionPath="/harmonizacoes" />
            </ContentSection>
          )}
        </div>
      </Container>
    </>
  );
}
