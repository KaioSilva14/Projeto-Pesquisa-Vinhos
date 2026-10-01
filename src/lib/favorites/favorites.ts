// Favoritos (F6-01): o que é guardado no navegador e como validar o que volta de lá.
// Sem Zod de propósito: este código vai para o navegador (o Zod pesa e esbarra na CSP).

export const favoriteKinds = ["wine", "grape", "region", "producer"] as const;
export type FavoriteKind = (typeof favoriteKinds)[number];

/** Um favorito: só tipo + id da entidade. Nome, foto etc. vêm do catálogo na hora de mostrar. */
export type FavoriteItem = { kind: FavoriteKind; id: string; savedAt: string };

/** Limite de segurança contra um localStorage manipulado com milhares de itens. */
export const MAX_FAVORITES = 500;

const ID = /^[a-z0-9-]{1,80}$/;
const isKind = (value: unknown): value is FavoriteKind =>
  favoriteKinds.includes(value as FavoriteKind);

export const sameFavorite = (
  a: Pick<FavoriteItem, "kind" | "id">,
  b: Pick<FavoriteItem, "kind" | "id">,
) => a.kind === b.kind && a.id === b.id;

/**
 * Lê com desconfiança o que estava salvo (SECURITY.md: o localStorage pode estar corrompido ou
 * manipulado): itens fora do formato são descartados, repetidos são unidos, e nada quebra.
 */
export function sanitizeFavorites(value: unknown): FavoriteItem[] {
  if (!Array.isArray(value)) return [];
  const items: FavoriteItem[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const { kind, id, savedAt } = entry as Record<string, unknown>;
    if (!isKind(kind) || typeof id !== "string" || !ID.test(id)) continue;
    if (items.some((item) => sameFavorite(item, { kind, id }))) continue;
    const date = typeof savedAt === "string" && Number.isFinite(Date.parse(savedAt)) ? savedAt : "";
    items.push({ kind, id, savedAt: date });
    if (items.length >= MAX_FAVORITES) break;
  }
  return items;
}
