import { EntityImage } from "@/components/media/EntityImage";
import type { ImageAsset } from "@/schemas/image-asset";

import { Section } from "./Section";

// Registro FICTÍCIO apontando para um arquivo que não existe: demonstra a troca automática
// pelo aviso "Imagem indisponível" quando o carregamento falha. Não é dado real.
const brokenImage: ImageAsset = {
  id: "img-demo-arquivo-ausente",
  src: "/images/demo/arquivo-que-nao-existe.jpg",
  alt: "Arquivo de teste que não existe (demonstração)",
  width: 1600,
  height: 1200,
  credit: "Demonstração",
  license: "Demonstração",
  sourceUrl: "https://example.org/demonstracao",
  subjectType: "grape",
  subjectId: "demonstracao",
  accessedAt: "2026-09-28",
};

// Vitrine de src/components/media (F1-16). Fotos reais entram a partir da F2-06, com licença.
export function MediaShowcase() {
  return (
    <Section title="Mídia">
      <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-4">
        <div className="grid gap-2">
          <EntityImage image={undefined} variant="bottle" sizes="25vw" />
          <p className="text-caption text-text-subtle">Garrafa 3:4, sem foto</p>
        </div>
        <div className="grid gap-2">
          <EntityImage image={undefined} variant="landscape" sizes="25vw" />
          <p className="text-caption text-text-subtle">Paisagem 3:2, sem foto</p>
        </div>
        <div className="grid gap-2">
          <EntityImage image={brokenImage} variant="grape" sizes="25vw" />
          <p className="text-caption text-text-subtle">Uva 4:3, arquivo com erro</p>
        </div>
        <div className="grid gap-2">
          <EntityImage image={undefined} variant="thumbnail" sizes="48px" className="w-12" />
          <p className="text-caption text-text-subtle">Miniatura 1:1 (compacta)</p>
        </div>
      </div>
    </Section>
  );
}
