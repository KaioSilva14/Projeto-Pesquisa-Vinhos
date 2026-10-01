"use client";

// Client Component: observa quando a seção entra na tela (ANIMATIONS.md A01).

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Entrada suave de seção editorial (A01), só com CSS + IntersectionObserver, sem biblioteca.
 * Seguro por padrão: o HTML do servidor já vem visível (sem JavaScript, nada some). Só o que
 * está abaixo da tela ao abrir a página espera para aparecer; com movimento reduzido, nada muda.
 */
export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"visible" | "waiting" | "entering">("visible");

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Já está na tela ao abrir: fica como está (não esconde o que a pessoa já vê)
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setState("waiting");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setState("entering");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={state}
      style={state === "waiting" ? { opacity: 0 } : undefined}
    >
      <div className={state === "entering" ? "animate-reveal" : undefined}>{children}</div>
    </div>
  );
}
