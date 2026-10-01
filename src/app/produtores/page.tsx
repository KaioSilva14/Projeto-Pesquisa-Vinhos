import type { Metadata } from "next";

import { EntityGrid } from "@/components/entity/EntityGrid";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { catalogService } from "@/services";

const DESCRIPTION =
  "Produtores do catálogo, com dados das fichas técnicas e páginas oficiais, e os vinhos de cada um.";

export const metadata: Metadata = {
  title: "Produtores",
  description: DESCRIPTION,
  alternates: { canonical: "/produtores" },
};

export default async function ProducersPage() {
  const producers = await catalogService.getProducerList();

  return (
    <>
      <PageHeader
        title="Produtores"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Produtores", href: "/produtores" },
        ]}
      />
      <Container className="pb-16">
        <EntityGrid
          items={producers}
          label="Lista de produtores"
          priorityFirst
          imageVariant="producer"
          favoriteKind="producer"
        />
      </Container>
    </>
  );
}
