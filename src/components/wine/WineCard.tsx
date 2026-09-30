import { CreditButton } from "@/components/media/CreditButton";
import { EntityImage } from "@/components/media/EntityImage";
import { Badge } from "@/components/ui/Badge";
import { Card, CardLink } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { WineListItem } from "@/lib/wines/list-item";

type WineCardProps = {
  wine: WineListItem;
  headingLevel?: "h2" | "h3" | "h4";
  /**
   * Reserva a área da garrafa mesmo sem foto ("Imagem indisponível"). A grade (WineGrid) liga
   * quando algum vinho da lista tem foto, para os cards ficarem alinhados (ADR-027).
   */
  reserveImage?: boolean;
};

const creditClass =
  "relative z-10 ml-auto inline-flex min-h-11 items-center text-caption text-text-subtle underline underline-offset-2 hover:text-text md:min-h-6";

/** Card de vinho (DESIGN.md §7.5): garrafa, nome, produtor, região · país, tipo e safra. */
export function WineCard({
  wine,
  headingLevel: Heading = "h2",
  reserveImage = false,
}: WineCardProps) {
  const showImage = Boolean(wine.image) || reserveImage;

  return (
    <Card className={cn("h-full", showImage && "overflow-hidden p-0 md:p-0")}>
      {showImage && (
        <EntityImage
          image={wine.image}
          variant="bottle"
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"
          // A foto encosta nas bordas do card (o card recorta os cantos)
          className="rounded-none [&>div]:rounded-none"
        />
      )}
      <div className={cn("flex flex-1 flex-col gap-3", showImage && "px-4 pb-4 md:px-5 md:pb-5")}>
        <Heading className="font-serif text-h4 text-balance">
          <CardLink href={wine.href}>{wine.name}</CardLink>
        </Heading>
        <div className="grid gap-0.5 text-small text-text-muted">
          {wine.producerName && <p>{wine.producerName}</p>}
          {wine.place && <p>{wine.place}</p>}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <Badge>{wine.typeLabel}</Badge>
          {wine.isNonVintage ? (
            <Badge>Multissafra</Badge>
          ) : (
            wine.latestYear !== undefined && <Badge>Safra {wine.latestYear}</Badge>
          )}
          {wine.image && <CreditButton image={wine.image} className={creditClass} />}
        </div>
      </div>
    </Card>
  );
}
