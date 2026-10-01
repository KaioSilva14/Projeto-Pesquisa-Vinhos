import { renderBrandIcon } from "@/lib/seo/brand-icon";

// Favicon (aba do navegador e resultados de busca). 96 px: múltiplo de 48, como o Google pede.
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return renderBrandIcon(size.width, { rounded: true });
}
