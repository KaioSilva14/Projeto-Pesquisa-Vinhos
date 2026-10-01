import { renderBrandIcon } from "@/lib/seo/brand-icon";

// Ícone "maskable" do Android (manifest.ts), gerado no build como arquivo estático
export const dynamic = "force-static";

export function GET() {
  return renderBrandIcon(512, "maskable");
}
