import { renderBrandIcon } from "@/lib/seo/brand-icon";

// Ícone ao salvar o site na tela inicial do iPhone/iPad.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderBrandIcon(size.width, { rounded: false });
}
