import Link from "next/link";

import { formatDate } from "@/lib/format";
import { SOURCE_KIND_LABELS } from "@/lib/labels";
import type { Source } from "@/schemas/source";

type SourceListProps = {
  /** Na ordem de citação: a posição na lista é o número usado nas notas. */
  sources: readonly Source[];
  /** Caminho da página: mostra o convite "Encontrou um erro?" com ele já preenchido. */
  correctionPath?: string;
};

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

/** Lista numerada "Fontes" (DESIGN.md §7.8): rótulo, quem publicou, tipo e data de consulta. */
export function SourceList({ sources, correctionPath }: SourceListProps) {
  return (
    <div className="grid gap-6">
      <ol className="grid gap-4">
        {sources.map((source, index) => (
          <li
            key={source.id}
            id={`fonte-${index + 1}`}
            className="grid scroll-mt-24 grid-cols-[2rem_1fr] gap-2 text-small target:bg-accent-soft"
          >
            <span className="text-text-subtle tabular-nums">{index + 1}.</span>
            <div className="grid gap-0.5">
              <p>
                {source.url ? (
                  <a href={source.url} rel="noopener noreferrer" className={linkClass}>
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </p>
              <p className="text-text-muted">
                {[source.publisher, SOURCE_KIND_LABELS[source.kind]].filter(Boolean).join(" · ")}
                {" · consultada em "}
                {formatDate(source.accessedAt)}
                {source.archivedUrl && (
                  <>
                    {" · "}
                    <a href={source.archivedUrl} rel="noopener noreferrer" className={linkClass}>
                      cópia arquivada
                    </a>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
      {correctionPath && (
        <p className="text-small text-text-muted">
          Encontrou um erro?{" "}
          <Link
            href={`/sugerir-correcao?pagina=${encodeURIComponent(correctionPath)}`}
            className={linkClass}
          >
            Sugira uma correção
          </Link>
          .
        </p>
      )}
    </div>
  );
}
