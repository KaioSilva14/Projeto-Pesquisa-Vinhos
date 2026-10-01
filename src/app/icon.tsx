import { renderBrandIcon } from "@/lib/seo/brand-icon";

// Ícones da aba do navegador, dos resultados de busca e do Android (manifest.ts).
// 96 px: múltiplo de 48, como o Google pede para o favicon nos resultados.
const SIZES = [32, 96, 192, 512] as const;

export function generateImageMetadata() {
  return SIZES.map((px) => ({
    id: String(px),
    size: { width: px, height: px },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return renderBrandIcon(Number(await id), "rounded");
}
