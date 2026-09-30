"use client";

// Client Component: escuta o teclado na página inteira (PRD RF04).

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SEARCH_COMBOBOX_SELECTOR } from "./SearchCombobox";

/** Foco está num lugar onde a pessoa digita texto? Então `/` é só uma barra. */
function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/** Campo de busca visível: prefere o da página (conteúdo principal) ao do cabeçalho. */
function visibleSearchField(): HTMLInputElement | undefined {
  const fields = [...document.querySelectorAll<HTMLInputElement>(SEARCH_COMBOBOX_SELECTOR)];
  const visible = fields.filter((field) => field.getClientRects().length > 0);
  return visible.find((field) => field.closest("main")) ?? visible[0];
}

/**
 * Atalhos `/` e `Ctrl+K` (`Cmd+K` no Mac) levam à busca. O `/` não age enquanto a pessoa digita
 * em outro campo (WCAG 2.1.4). Sem campo visível (celular), abre a página de pesquisa.
 */
export function SearchShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing) return;
      const isSlash = event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey;
      const isCtrlK = event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey);
      if (!isCtrlK && !(isSlash && !isTyping(event.target))) return;

      event.preventDefault();
      const field = visibleSearchField();
      if (field) {
        field.focus();
        field.select();
      } else {
        router.push("/pesquisa");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
