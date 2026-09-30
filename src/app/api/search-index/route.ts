import { catalogService } from "@/services";

// Índice do autocomplete (ARCHITECTURE.md §6 e §8): gerado uma vez no build e servido como
// arquivo estático. O navegador só o baixa quando o visitante foca a busca (F3-03).
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await catalogService.getSearchDocuments());
}
