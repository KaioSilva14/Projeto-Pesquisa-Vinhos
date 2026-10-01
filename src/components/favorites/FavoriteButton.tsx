"use client";

// Client Component: o estado de favorito vive no navegador (localStorage).

import { useState } from "react";

import { IconButton } from "@/components/ui/IconButton";
import { HeartIcon } from "@/components/ui/icons";
import type { FavoriteKind } from "@/lib/favorites/favorites";
import { useFavorites, useFavoritesHydrated } from "@/stores/favorites";

type FavoriteButtonProps = {
  kind: FavoriteKind;
  id: string;
  /** Nome da entidade, para o rótulo: "Salvar Malbec nos favoritos". */
  name: string;
  variant?: "ghost" | "secondary";
  className?: string;
};

/**
 * Botão de favorito (DESIGN.md §7.8, ACCESSIBILITY.md §3.5): `aria-pressed` com rótulo que muda
 * e aviso para leitores de tela. Até ler o navegador, fica desligado (evita mostrar estado errado).
 */
export function FavoriteButton({
  kind,
  id,
  name,
  variant = "secondary",
  className,
}: FavoriteButtonProps) {
  const hydrated = useFavoritesHydrated();
  const saved = useFavorites((state) =>
    state.items.some((item) => item.kind === kind && item.id === id),
  );
  const toggle = useFavorites((state) => state.toggle);
  const [message, setMessage] = useState("");
  // Conta os cliques: a chave nova reinicia a animação do ícone (ANIMATIONS.md A12)
  const [clicks, setClicks] = useState(0);
  const pressed = hydrated && saved;

  return (
    <>
      <IconButton
        variant={variant}
        aria-pressed={pressed}
        aria-label={pressed ? `Remover ${name} dos favoritos` : `Salvar ${name} nos favoritos`}
        disabled={!hydrated}
        onClick={() => {
          setClicks((count) => count + 1);
          setMessage(
            toggle(kind, id) ? `${name} salvo nos favoritos` : `${name} removido dos favoritos`,
          );
        }}
        className={className}
      >
        <HeartIcon
          key={clicks}
          aria-hidden
          weight={pressed ? "fill" : "regular"}
          className={clicks > 0 && pressed ? "motion-safe:animate-heart-pop" : undefined}
        />
      </IconButton>
      <span role="status" className="sr-only">
        {message}
      </span>
    </>
  );
}
