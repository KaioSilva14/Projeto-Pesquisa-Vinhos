import { useId, type ReactNode } from "react";

type ContentSectionProps = {
  /** Título (<h2>) que também nomeia a seção para leitores de tela. */
  title: string;
  children: ReactNode;
  id?: string;
};

/** Seção dentro de uma coluna de conteúdo (páginas de entidade). */
export function ContentSection({ title, children, id }: ContentSectionProps) {
  const headingId = useId();

  return (
    <section id={id} aria-labelledby={headingId} className="grid scroll-mt-24 gap-6">
      <h2 id={headingId} className="font-serif text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}
