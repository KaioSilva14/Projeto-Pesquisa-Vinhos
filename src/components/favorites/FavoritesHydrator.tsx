"use client";

// Client Component: lê os favoritos do navegador depois que a página abre (o servidor não os vê).

import { useEffect } from "react";

import { FAVORITES_STORAGE_KEY, useFavorites } from "@/stores/favorites";

/** Carrega os favoritos salvos e mantém as abas abertas em sincronia. Não desenha nada. */
export function FavoritesHydrator() {
  useEffect(() => {
    void useFavorites.persist.rehydrate();
    // Favoritou em outra aba? O navegador avisa por este evento
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) void useFavorites.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
