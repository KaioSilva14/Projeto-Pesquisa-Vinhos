import type { Metadata } from "next";

import { EntityGrid } from "@/components/entity/EntityGrid";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { catalogService } from "@/services";

const DESCRIPTION =
  "Os países do catálogo do Vinum, com suas regiões vinícolas, produtores e vinhos.";

export const metadata: Metadata = {
  title: "Países",
  description: DESCRIPTION,
  alternates: { canonical: "/paises" },
};

export default async function CountriesPage() {
  const countries = await catalogService.getCountryList();

  return (
    <>
      <PageHeader
        title="Países"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Países", href: "/paises" },
        ]}
      />
      <Container className="pb-16">
        <EntityGrid items={countries} label="Lista de países" imageVariant="landscape" />
      </Container>
    </>
  );
}
