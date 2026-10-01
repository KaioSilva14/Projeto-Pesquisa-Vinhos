"use client";

// Client Component: avisa quando a página saiu do topo (ANIMATIONS.md A15).

import { useEffect, useRef } from "react";

/**
 * Marcador invisível no topo da página. Quando ele sai da tela, marca `<html data-scrolled>` e o
 * cabeçalho ganha sombra. Usa IntersectionObserver (nada de escutar o evento de rolagem).
 */
export function ScrollSentinel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.toggleAttribute(
        "data-scrolled",
        entry ? !entry.isIntersecting : false,
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden className="pointer-events-none absolute top-0 h-2 w-px" />;
}
