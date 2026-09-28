// Entidades FICTÍCIAS, só para testes (TESTING.md §4). Nenhuma corresponde a algo real.

export const base = {
  status: "published" as const,
  createdAt: "2026-09-28",
  updatedAt: "2026-09-28",
  sourceIds: ["src-teste-01"],
};

export const exampleSource = {
  id: "src-teste-01",
  kind: "other" as const,
  label: "Fonte de teste (não é um documento real)",
  accessedAt: "2026-09-28",
  reliability: "secondary" as const,
};

export const exampleGrape = {
  ...base,
  id: "uva-exemplo",
  slug: "uva-exemplo",
  name: "Uva Exemplo",
  vivcId: "123",
  color: { value: "tinta" as const, sourceIds: ["src-teste-01"] },
};

export const exampleWine = {
  ...base,
  id: "vinho-exemplo-01",
  slug: "vinho-exemplo-01",
  name: "Vinho Exemplo 01",
  producerId: "produtor-exemplo",
  countryId: "xx",
  type: { value: "tinto" as const, sourceIds: ["src-teste-01"] },
};

export const exampleVintage = {
  id: "vinho-exemplo-01-2020",
  wineId: "vinho-exemplo-01",
  year: 2020,
};
