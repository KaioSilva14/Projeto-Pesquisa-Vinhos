import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { CreditButton } from "@/components/media/CreditButton";
import { EntityImage } from "@/components/media/EntityImage";
import { Card, CardLink } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { FavoriteKind } from "@/lib/favorites/favorites";
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
  /**
   * Reserva a área da foto mesmo sem foto ("Imagem indisponível"). Em uma grade em que nenhum
   * card tem foto, desligue: repetir o aviso em todos não informa nada (ADR-027).
   */
  reserveImage?: boolean;
  headingLevel?: "h2" | "h3";
  /** Mostra o botão de favorito para esta entidade. */
  favorite?: { kind: FavoriteKind; id: string } | undefined;
  /** Largura da foto em cada tela, quando o card não segue a grade padrão (IMAGES.md §4). */
  imageSizes?: string;
  /** Foto carregada com prioridade (1º card de uma lista no topo da página). */
  priority?: boolean;
};

const GRID_SIZES = "(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw";

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
  reserveImage = true,
  headingLevel: Heading = "h2",
  favorite,
  imageSizes = GRID_SIZES,
  priority = false,
}: EntityCardProps) {
  const showImage = Boolean(image) || reserveImage;
  return (
    <Card className={cn("h-full overflow-hidden p-0 md:p-0", !showImage && "pt-4 md:pt-5")}>
      {showImage && (
        <EntityImage
          image={image}
          variant={imageVariant}
          sizes={imageSizes}
          priority={priority}
          // A foto encosta nas bordas do card (o card recorta os cantos)
          className="rounded-none [&>div]:rounded-none"
        />
      )}
      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 md:px-5 md:pb-5">
        <Heading className="font-serif text-h4">
          <CardLink href={href}>{name}</CardLink>
        </Heading>
        {context && <p className="text-small text-text-muted">{context}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {wineCount !== undefined && (
            <p className="text-small text-text-muted">{vinhos(wineCount)}</p>
          )}
          {/* Acima do link do card (z-10): clicar aqui não abre a página */}
          <div className="ml-auto flex items-center gap-1">
            {image && <CreditButton image={image} />}
            {favorite && (
              <FavoriteButton
                kind={favorite.kind}
                id={favorite.id}
                name={name}
                variant="ghost"
                className="relative z-10"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
