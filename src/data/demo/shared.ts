// DADOS DE DEMONSTRAÇÃO: tudo nesta pasta é FICTÍCIO (CLAUDE.md §2.1). Nenhum nome, número ou
// texto corresponde a vinho, produtor ou lugar real. Serve só para testar a interface.

/** Campos comuns de toda entidade de demonstração. */
export const demo = {
  isDemo: true as const,
  status: "published" as const,
  createdAt: "2026-09-28",
  updatedAt: "2026-09-28",
  sourceIds: ["src-demo-01"],
};

/** "Fonte" citada pelos dados de demonstração. */
export const demoSource = { sourceIds: ["src-demo-01"] as [string] };

/** Texto editorial de demonstração (o sufixo deixa claro que é fictício). */
export function demoText(text: string) {
  return {
    text: `${text} Texto fictício de demonstração.`,
    basedOnSourceIds: ["src-demo-01"] as [string],
    writtenAt: "2026-09-28",
  };
}
