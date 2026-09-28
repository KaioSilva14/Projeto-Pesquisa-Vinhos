import type { ImageAsset } from "@/schemas/image-asset";

// Dados FICTÍCIOS, só para testes (TESTING.md §4). Nenhum arquivo, autor ou entidade real.
export const exampleImage: ImageAsset = {
  id: "img-teste-uva-exemplo",
  src: "/images/grapes/uva-exemplo-01.jpg",
  alt: "Cacho de uvas da Uva Exemplo (imagem fictícia de teste)",
  width: 1600,
  height: 1200,
  credit: "Autor Exemplo",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  sourceUrl: "https://example.org/foto-exemplo",
  subjectType: "grape",
  subjectId: "uva-exemplo",
  accessedAt: "2026-09-28",
};
