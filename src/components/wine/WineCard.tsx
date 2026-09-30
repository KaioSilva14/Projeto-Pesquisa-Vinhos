import { Badge } from "@/components/ui/Badge";
import { Card, CardLink } from "@/components/ui/Card";
import type { WineListItem } from "@/lib/wines/list-item";

type WineCardProps = {
  wine: WineListItem;
  headingLevel?: "h2" | "h3";
};

/**
 * Card de vinho (DESIGN.md §7.5): nome, produtor, região · país, tipo e safra.
 * Sem área de foto enquanto o vinho não tiver fotografia real com crédito: uma lista de
 * "imagem indisponível" repetida não informa nada.
 */
export function WineCard({ wine, headingLevel: Heading = "h2" }: WineCardProps) {
  return (
    <Card className="h-full">
      <Heading className="font-serif text-h4 text-balance">
        <CardLink href={wine.href}>{wine.name}</CardLink>
      </Heading>
      <div className="grid gap-0.5 text-small text-text-muted">
        {wine.producerName && <p>{wine.producerName}</p>}
        {wine.place && <p>{wine.place}</p>}
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <Badge>{wine.typeLabel}</Badge>
        {wine.isNonVintage ? (
          <Badge>Multissafra</Badge>
        ) : (
          wine.latestYear !== undefined && <Badge>Safra {wine.latestYear}</Badge>
        )}
      </div>
    </Card>
  );
}
