"use client";

// Client Component: precisa reagir a erro de carregamento (onError) trocando pelo aviso honesto.

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/schemas/image-asset";

import { ImageCredit } from "./ImageCredit";
import { ImageUnavailable } from "./ImageUnavailable";

// Proporção e enquadramento por contexto (DESIGN.md §9). Garrafa usa "contain" para não cortar o rótulo.
const variants = {
  bottle: { aspect: "aspect-[3/4]", fit: "object-contain" },
  landscape: { aspect: "aspect-[3/2]", fit: "object-cover" },
  grape: { aspect: "aspect-[4/3]", fit: "object-cover" },
  producer: { aspect: "aspect-[3/2]", fit: "object-cover" },
  editorial: { aspect: "aspect-video", fit: "object-cover" },
  thumbnail: { aspect: "aspect-square", fit: "object-cover" },
} as const;

type EntityImageProps = {
  /** Sem imagem (undefined) → "Imagem indisponível". Nunca passe uma imagem de outra entidade. */
  image: ImageAsset | undefined;
  variant: keyof typeof variants;
  /** Largura ocupada em cada tela, para o navegador baixar o tamanho certo (IMAGES.md §4). */
  sizes: string;
  /** Só na imagem principal da página (LCP). */
  priority?: boolean;
  showCredit?: boolean;
  className?: string;
};

export function EntityImage({
  image,
  variant,
  sizes,
  priority = false,
  showCredit = false,
  className,
}: EntityImageProps) {
  const [failed, setFailed] = useState(false);
  const { aspect, fit } = variants[variant];

  if (!image || failed) {
    return <ImageUnavailable className={cn(aspect, className)} compact={variant === "thumbnail"} />;
  }

  return (
    <figure className={cn("grid gap-2", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-media",
          aspect,
          // Moldura branca: o fundo branco das fotos de produtor se funde a ela. No tema escuro,
          // moldura e foto escurecem juntas, para não ofuscar
          fit === "object-contain" && "bg-bottle-frame dark:brightness-[0.88]",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          quality={85}
          priority={priority}
          // A02: dentro de um card, a foto cresce 3% no hover (só com mouse, sem movimento reduzido)
          className={cn(
            fit,
            "transition-transform duration-(--duration-base) ease-out motion-safe:group-hover/card:scale-[1.03]",
          )}
          // Valores que dependem da foto: por isso style em vez de classe
          style={{
            // Ponto focal
            ...(image.focalPoint && {
              objectPosition: `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`,
            }),
            // Garrafa nunca maior que o arquivo: esticada, ficaria borrada (IMAGES.md §4)
            ...(fit === "object-contain" && {
              maxWidth: image.width,
              maxHeight: image.height,
              margin: "auto",
            }),
          }}
          {...(image.blurDataURL && { placeholder: "blur", blurDataURL: image.blurDataURL })}
          onError={() => setFailed(true)}
        />
      </div>
      {showCredit && (
        <figcaption>
          <ImageCredit image={image} />
        </figcaption>
      )}
    </figure>
  );
}
