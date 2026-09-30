import { SEARCH_KIND_LABELS } from "@/lib/labels";
import type { SuggestionGroup } from "@/lib/search/group";
import { cn } from "@/lib/cn";

type SuggestionListProps = {
  id: string;
  groups: readonly SuggestionGroup[];
  query: string;
  /** Posição da opção destacada pelo teclado (-1 = nenhuma). */
  activeIndex: number;
  optionId: (index: number) => string;
  onChoose: (index: number) => void;
};

const optionClass = "flex min-h-11 cursor-pointer flex-col justify-center rounded-sm px-3 py-2";

/**
 * Listbox das sugestões (ACCESSIBILITY.md §3.1): grupos por tipo e, por último, a opção
 * "Ver todos os resultados". O foco continua no campo; a opção ativa vem por
 * aria-activedescendant.
 */
export function SuggestionList({
  id,
  groups,
  query,
  activeIndex,
  optionId,
  onChoose,
}: SuggestionListProps) {
  let position = 0;
  const seeAllIndex = groups.reduce((total, group) => total + group.results.length, 0);

  const optionProps = (index: number) => ({
    id: optionId(index),
    role: "option" as const,
    "aria-selected": index === activeIndex,
    onClick: () => onChoose(index),
    className: cn(optionClass, index === activeIndex && "bg-sunken"),
  });

  return (
    // mouseDown sem efeito padrão: clicar numa opção não tira o foco do campo antes do clique
    <div
      id={id}
      role="listbox"
      aria-label="Sugestões"
      onMouseDown={(event) => event.preventDefault()}
    >
      {groups.map((group) => {
        const labelId = `${id}-${group.kind}`;
        return (
          <div key={group.kind} role="group" aria-labelledby={labelId} className="pb-2">
            <div
              id={labelId}
              role="presentation"
              className="px-3 pt-2 pb-1 text-caption tracking-wide text-text-subtle uppercase"
            >
              {SEARCH_KIND_LABELS[group.kind].many}
            </div>
            {group.results.map(({ document }) => (
              <div key={document.id} {...optionProps(position++)}>
                <span className="truncate font-serif text-body">{document.name}</span>
                {document.subtitle && (
                  <span className="truncate text-small text-text-muted">{document.subtitle}</span>
                )}
              </div>
            ))}
          </div>
        );
      })}
      <div {...optionProps(seeAllIndex)}>
        <span className="text-small text-accent">Ver todos os resultados para “{query}”</span>
      </div>
    </div>
  );
}
