import type { ReactNode } from "react";

// Pastas com "_" não viram rota no App Router: servem para organizar arquivos da página
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-8 font-serif text-h2">{title}</h2>
      {children}
    </section>
  );
}
