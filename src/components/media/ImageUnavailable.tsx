import { ImageBrokenIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type ImageUnavailableProps = {
  /** Proporção da imagem esperada (ex.: "aspect-[3/4]"), para a página não "pular". */
  className?: string;
  /** Versão só com ícone, para miniaturas pequenas. */
  compact?: boolean;
};

/**
 * Estado honesto quando não há foto real com licença verificada (CLAUDE.md §2.2, IMAGES.md §6).
 * Nunca desenha garrafa, silhueta ou qualquer imagem substituta.
 */
export function ImageUnavailable({ className, compact = false }: ImageUnavailableProps) {
  return (
    <div
      role="img"
      aria-label="Imagem indisponível"
      className={cn(
        // overflow-hidden: sem ele, uma caixa com proporção fixa cresce (e vaza) quando o
        // texto não cabe. @container: o conteúdo se adapta ao tamanho do painel, não da tela.
        "@container flex min-w-0 flex-col items-center justify-center gap-2 overflow-hidden rounded-media bg-sunken p-3 text-center text-text-subtle",
        className,
      )}
    >
      <ImageBrokenIcon
        aria-hidden
        weight="light"
        className={compact ? "size-5" : "size-6 shrink-0 @min-[12rem]:size-10"}
      />
      {!compact && (
        <div aria-hidden className="grid gap-0.5">
          <p className="text-caption font-medium text-text-muted @min-[12rem]:text-small">
            Imagem indisponível
          </p>
          <p className="hidden text-caption @min-[16rem]:block">
            Ainda não temos uma foto com licença verificada.
          </p>
        </div>
      )}
    </div>
  );
}
