import type { Pairing, PairingCategory } from "@/schemas/pairing";

// Harmonizações (F4-06): só pratos que os próprios produtores sugerem nas fichas e páginas
// oficiais (src/data/sources.ts), lidas no texto bruto em 2026-10-01. O nome é a tradução fiel do
// que a fonte diz; a ligação vinho → prato fica em ./wines.ts (pairingIds), com a fonte.
// Vinhos cujas fontes não sugerem pratos ficam sem harmonização (nada estimado).
//   Gran Reserva 904: "carnes y pescados no demasiado especiados y postres con chocolate"
//   Lagar de Cervera: "cualquier aperitivo… marisco y pescado… ensaladas, arroces de pescado,
//     aves, quesos frescos… platos asiáticos como, por ejemplo, el sushi o el sashimi"
//   Miolo Lote 43: "culinária francesa e italiana… assados de carnes de caça, o churrasco gaúcho,
//     em especial o espeto de medalhões de picanha"

function pairing(id: string, category: PairingCategory, name: string, cuisine?: string): Pairing {
  return {
    id,
    slug: id,
    status: "published",
    createdAt: "2026-10-01",
    updatedAt: "2026-10-01",
    // O prato em si não é um fato; a fonte fica na ligação com cada vinho
    sourceIds: [],
    category,
    name,
    ...(cuisine && { cuisine }),
  };
}

export const pairings: Pairing[] = [
  pairing("aperitivos", "entradas", "Aperitivos"),
  pairing("saladas", "entradas", "Saladas"),
  pairing("carnes-pouco-condimentadas", "carnes", "Carnes pouco condimentadas"),
  pairing("carnes-de-caca-assadas", "carnes", "Carnes de caça assadas"),
  pairing("churrasco", "carnes", "Churrasco, como espeto de medalhões de picanha"),
  pairing("aves", "aves", "Aves"),
  pairing("peixes-pouco-condimentados", "peixes-e-frutos-do-mar", "Peixes pouco condimentados"),
  pairing("peixes", "peixes-e-frutos-do-mar", "Peixes"),
  pairing("frutos-do-mar", "peixes-e-frutos-do-mar", "Frutos do mar"),
  pairing("arroz-com-peixe", "peixes-e-frutos-do-mar", "Arroz com peixe"),
  pairing("queijos-frescos", "queijos", "Queijos frescos"),
  pairing("sushi-e-sashimi", "culinarias", "Sushi e sashimi", "Culinária asiática"),
  pairing(
    "culinarias-francesa-e-italiana",
    "culinarias",
    "Culinárias francesa e italiana",
    "Culinárias francesa e italiana",
  ),
  pairing("sobremesas-com-chocolate", "sobremesas", "Sobremesas com chocolate"),
];
