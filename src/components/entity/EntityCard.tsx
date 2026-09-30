import { CreditButton } from "@/components/media/CreditButton";
import { EntityImage } from "@/components/media/EntityImage";
import { Card, CardLink } from "@/components/ui/Card";
import type { ImageAsset } from "@/schemas/image-asset";

type EntityCardProps = {
  name: string;
  href: string;
  /** Uma linha de contexto, ex.: "Uva tinta · Itália". */
  context?: string | undefined;
  image?: ImageAsset | undefined;
  /** Quantos vinhos do catálogo se ligam a esta entidade. */
  wineCount?: number | undefined;
  imageVariant?: "grape" | "landscape" | "producer";
  headingLevel?: "h2" | "h3";
};

const vinhos = (count: number) =>
  count === 0 ? "Nenhum vinho no catálogo" : count === 1 ? "1 vinho" : `${count} vinhos`;

/**
 * Card de uva, região, produtor ou país (DESIGN.md §7.5): foto real (ou "Imagem indisponível"),
 * nome, contexto e contagem de vinhos. O crédito da foto fica no botão "Créditos".
 */
export function EntityCard({
  name,
  href,
  context,
  image,
  wineCount,
  imageVariant = "grape",
  headingLevel: Heading = "h2",
}: EntityCardProps) {
  return (
    <Card className="h-full overflow-hidden p-0 md:p-0">
      <EntityImage
        image={image}
        variant={imageVariant}
        sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"
        // A foto encosta nas bordas do card (o card recorta os cantos)
        className="rounded-none [&>div]:rounded-none"
      />
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 md:px-5 md:pb-5">
        <Heading className="font-serif text-h4">
          <CardLink href={href}>{name}</CardLink>
        </Heading>
        {context && <p className="text-small text-text-muted">{context}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {wineCount !== undefined && (
            <p className="text-small text-text-muted">{vinhos(wineCount)}</p>
          )}
          {image && <CreditButton image={image} />}
        </div>
      </div>
    </Card>
  );
}
