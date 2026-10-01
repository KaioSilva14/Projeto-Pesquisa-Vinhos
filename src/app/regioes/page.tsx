import type { Metadata } from "next";
import Link from "next/link";

import { EntityGrid } from "@/components/entity/EntityGrid";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { catalogService } from "@/services";

const DESCRIPTION =
  "Regiões e denominações de origem do catálogo, com uvas principais confirmadas em regulamentos e órgãos oficiais, produtores e vinhos.";

export const metadata: Metadata = {
  title: "Regiões",
  description: DESCRIPTION,
  alternates: { canonical: "/regioes" },
};

export default async function RegionsPage() {
  const groups = await catalogService.getRegionGroups();

  return (
    <>
      <PageHeader
        title="Regiões"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Regiões", href: "/regioes" },
        ]}
      />
      <Container className="grid gap-14 pb-16">
        {groups.map(({ country, regions }) => (
          <section key={country.href} aria-label={country.name} className="grid gap-6">
            <h2 className="font-serif text-h2">
              <Link href={country.href} className="hover:text-accent">
                {country.name}
              </Link>
            </h2>
            <EntityGrid
              items={regions}
              label={`Regiões: ${country.name}`}
              imageVariant="landscape"
              headingLevel="h3"
              favoriteKind="region"
            />
          </section>
        ))}
      </Container>
    </>
  );
}
