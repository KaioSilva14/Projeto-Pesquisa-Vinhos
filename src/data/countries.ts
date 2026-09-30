import type { Country } from "@/schemas/geography";

// Os 6 países do escopo inicial (ADR-019). Só identidade (código ISO e nome em português):
// fatos sobre cada país (resumo, mapas) entram depois, com fonte.

const country = (id: string, slug: string, name: string): Country => ({
  id,
  slug,
  name,
  status: "published",
  createdAt: "2026-09-30",
  updatedAt: "2026-09-30",
  sourceIds: [],
});

export const countries: Country[] = [
  country("it", "italia", "Itália"),
  country("fr", "franca", "França"),
  country("es", "espanha", "Espanha"),
  country("us", "estados-unidos", "Estados Unidos"),
  country("ar", "argentina", "Argentina"),
  country("br", "brasil", "Brasil"),
];
