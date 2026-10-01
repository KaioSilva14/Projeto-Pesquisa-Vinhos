import type { Metadata } from "next";

import { EntityGrid } from "@/components/entity/EntityGrid";
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
        <EntityGrid
          items={grapes}
          label="Lista de uvas"
          priorityFirst
          imageVariant="grape"
          favoriteKind="grape"
        />
      </Container>
    </>
  );
}
