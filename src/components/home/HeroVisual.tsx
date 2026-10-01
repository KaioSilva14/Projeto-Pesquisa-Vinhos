import Link from "next/link";

import { EntityImage } from "@/components/media/EntityImage";
import { ImageCredit } from "@/components/media/ImageCredit";
import type { ImageAsset } from "@/schemas/image-asset";

type HeroVisualProps = {
  image: ImageAsset;
  place: { name: string; href: string };
};

/** Lado visual da abertura (só em telas ≥ 1024 px): foto real de vinhedo, com crédito. */
export function HeroVisual({ image, place }: HeroVisualProps) {
  return (
    <div className="grid gap-3">
      <div className="relative">
        <EntityImage
          image={image}
          variant="portrait"
          // Some no celular: com "1px", o navegador baixa só a menor versão para o preload
          sizes="(min-width: 1024px) 26rem, 1px"
          priority
        />
        {/* A base da foto se dissolve no fundo da página */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-media bg-linear-to-b from-transparent from-55% to-bg"
        />
      </div>
      <div className="grid gap-1">
        <p className="text-small text-text-muted">
          Vinhedo em{" "}
          <Link href={place.href} className="underline underline-offset-4 hover:text-text">
            {place.name}
          </Link>
        </p>
        <ImageCredit image={image} />
      </div>
    </div>
  );
}
