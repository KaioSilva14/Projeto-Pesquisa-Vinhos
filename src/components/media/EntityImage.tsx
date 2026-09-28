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
          fit === "object-contain" && "bg-sunken",
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={fit}
          // Ponto focal da foto (valor dinâmico: por isso style em vez de classe)
          style={
            image.focalPoint && {
              objectPosition: `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`,
            }
          }
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
