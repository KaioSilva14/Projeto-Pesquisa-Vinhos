import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";

import {
  MAX_FAVORITES,
  sameFavorite,
  sanitizeFavorites,
  type FavoriteItem,
  type FavoriteKind,
} from "@/lib/favorites/favorites";

// Favoritos no localStorage (F6-01, ADR-005): sem conta, sem banco. Se o armazenamento estiver
// indisponível (aba anônima, bloqueio do navegador), os favoritos valem só até fechar a aba.

export const FAVORITES_STORAGE_KEY = "vinum-favoritos";

type PersistedFavorites = { items: FavoriteItem[] };

const memory = new Map<string, string>();

/** localStorage com plano B em memória e leitura que não quebra com JSON corrompido. */
const safeStorage: PersistStorage<PersistedFavorites> = {
  getItem: (name) => {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(name);
    } catch {
      raw = memory.get(name) ?? null;
    }
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as StorageValue<PersistedFavorites>;
    } catch {
      return null; // corrompido: começa vazio em vez de quebrar a página
    }
  },
  setItem: (name, value) => {
    const raw = JSON.stringify(value);
    try {
      window.localStorage.setItem(name, raw);
    } catch {
      memory.set(name, raw);
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      memory.delete(name);
    }
  },
};

type FavoritesState = PersistedFavorites & {
  /** Salva ou remove; devolve se o item ficou salvo. */
  toggle: (kind: FavoriteKind, id: string) => boolean;
  remove: (kind: FavoriteKind, id: string) => void;
  clear: () => void;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (kind, id) => {
        const saved = get().items.some((item) => sameFavorite(item, { kind, id }));
        if (saved) {
          set({ items: get().items.filter((item) => !sameFavorite(item, { kind, id })) });
          return false;
        }
        const added = { kind, id, savedAt: new Date().toISOString() };
        set({ items: [added, ...get().items].slice(0, MAX_FAVORITES) });
        return true;
      },
      remove: (kind, id) =>
        set({ items: get().items.filter((item) => !sameFavorite(item, { kind, id })) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      version: 1,
      storage: safeStorage,
      partialize: (state) => ({ items: state.items }),
      // O que vem do navegador é sempre validado antes de entrar no estado
      merge: (persisted, current) => ({
        ...current,
        items: sanitizeFavorites((persisted as Partial<PersistedFavorites> | undefined)?.items),
      }),
      migrate: (persisted) => ({
        items: sanitizeFavorites((persisted as Partial<PersistedFavorites> | undefined)?.items),
      }),
      // O servidor não conhece o localStorage: a leitura acontece só no navegador (R13)
      skipHydration: true,
    },
  ),
);

const subscribeHydration = (onChange: () => void) =>
  useFavorites.persist.onFinishHydration(onChange);

/** Já leu os favoritos do navegador? Antes disso, os botões não mostram estado (sem piscar). */
export function useFavoritesHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useFavorites.persist.hasHydrated(),
    () => false,
  );
}
