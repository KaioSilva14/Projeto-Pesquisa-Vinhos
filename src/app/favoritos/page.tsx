import type { Metadata } from "next";

import { FavoritesView } from "@/components/favorites/FavoritesView";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { catalogService } from "@/services";

// Conteúdo pessoal: fora dos buscadores (SEO.md §2)
export const metadata: Metadata = {
  title: "Favoritos",
  robots: { index: false, follow: true },
};

/**
 * Favoritos (F6-02): a casca é estática; a lista vem do navegador (ARCHITECTURE.md §6). O
 * servidor manda o catálogo resumido para mostrar nome, foto e contexto de cada favorito.
 */
export default async function FavoritesPage() {
  const [{ items: wines }, grapes, regionGroups, producers] = await Promise.all([
    catalogService.getWineList(),
    catalogService.getGrapeList(),
    catalogService.getRegionGroups(),
    catalogService.getProducerList(),
  ]);

  return (
    <>
      <PageHeader
        title="Favoritos"
        description="O que você guardou para ver depois. Os favoritos ficam salvos só neste navegador, sem cadastro."
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Favoritos", href: "/favoritos" },
        ]}
      />
      <Container className="pb-16">
        <FavoritesView
          catalog={{
            wines,
            grapes,
            regions: regionGroups.flatMap((group) => group.regions),
            producers,
          }}
        />
      </Container>
    </>
  );
}
