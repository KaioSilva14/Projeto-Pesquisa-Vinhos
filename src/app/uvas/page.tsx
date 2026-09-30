import type { Metadata } from "next";

import { EntityCard } from "@/components/entity/EntityCard";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { catalogService } from "@/services";

const DESCRIPTION =
  "Uvas viníferas com origem, sinônimos e regiões confirmados no catálogo internacional de variedades (VIVC), e os vinhos do catálogo feitos com cada uma.";

export const metadata: Metadata = {
  title: "Uvas",
  description: DESCRIPTION,
  alternates: { canonical: "/uvas" },
};

export default async function GrapesPage() {
  const grapes = await catalogService.getGrapeList();

  return (
    <>
      <PageHeader
        title="Uvas"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Uvas", href: "/uvas" },
        ]}
      />
      <Container className="pb-16">
        <ul
          aria-label="Lista de uvas"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {grapes.map((grape) => (
            <li key={grape.id}>
              <EntityCard {...grape} imageVariant="grape" />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
