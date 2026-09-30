"use client";

// Client Component: sugestões enquanto o visitante digita (F3-03, padrão combobox da WAI-ARIA).
// Sem JavaScript, ou se o índice falhar, o campo continua enviando o formulário para /pesquisa.

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";

import { SearchInput } from "@/components/ui/SearchInput";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { cn } from "@/lib/cn";
import { groupResults } from "@/lib/search/group";
import { searchHref } from "@/lib/search/url";
import { MAX_QUERY_LENGTH, queryTerms } from "@/lib/search/search";

import { SuggestionList } from "./SuggestionList";

const DEBOUNCE_MS = 120;
const MAX_PER_GROUP = 5;

/** Seletor dos campos que os atalhos `/` e `Ctrl+K` focam (SearchShortcuts). */
export const SEARCH_COMBOBOX_SELECTOR = "[data-search-combobox]";

type SearchComboboxProps = {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  /** Foca o campo ao abrir a página (só na página de pesquisa). */
  focusOnMount?: boolean;
  shortcutHint?: string;
  className?: string;
  /** Posição e largura da caixa de sugestões. */
  popupClassName?: string;
};

export function SearchCombobox({
  label,
  placeholder,
  defaultValue = "",
  focusOnMount = false,
  shortcutHint,
  className,
  popupClassName = "inset-x-0",
}: SearchComboboxProps) {
  const router = useRouter();
  const baseId = useId();
  const inputId = `${baseId}-campo`;
  const listboxId = `${baseId}-sugestoes`;
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  // A opção ativa vale só para a busca em que foi escolhida: digitar de novo a zera
  const [active, setActive] = useState({ query: "", index: -1 });
  const { status: indexStatus, searcher, load: loadIndex } = useSearchIndex();
  const debounced = useDebouncedValue(query, DEBOUNCE_MS).trim();
  const hasTerms = queryTerms(debounced).length > 0;

  const groups = useMemo(
    () => (searcher && hasTerms ? groupResults(searcher(debounced), MAX_PER_GROUP) : []),
    [searcher, debounced, hasTerms],
  );
  const hrefs = [
    ...groups.flatMap((group) => group.results.map((result) => result.document.href)),
    searchHref({ q: debounced }),
  ];
  const suggestionCount = hrefs.length - 1;
  const open = focused && !dismissed && hasTerms;
  const showList = open && indexStatus === "ready" && suggestionCount > 0;
  const activeIndex = showList && active.query === debounced ? active.index : -1;
  const optionId = (position: number) => `${baseId}-opcao-${position}`;

  useEffect(() => {
    const input = document.getElementById(inputId);
    if (!(input instanceof HTMLInputElement)) return;
    // Texto digitado antes de o React assumir a página (conexão lenta) não se perde. Único jeito
    // de ler o que o navegador já tem na tela, por isso o setState dentro do efeito.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (input.value !== defaultValue) setQuery(input.value);
    if (focusOnMount) input.focus();
    // Só na montagem: depois disso o React controla o campo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(position: number) {
    const href = hrefs[position];
    if (!href) return;
    setDismissed(true);
    router.push(href);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!showList) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (activeIndex + step + hrefs.length) % hrefs.length;
      setActive({
        query: debounced,
        index: activeIndex === -1 && step === -1 ? hrefs.length - 1 : next,
      });
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault(); // sem opção ativa, o Enter envia o formulário para /pesquisa
      choose(activeIndex);
    } else if (event.key === "Escape") {
      // 1º Esc fecha as sugestões (sem o navegador apagar o texto); o 2º limpa o campo
      if (open) {
        event.preventDefault();
        setDismissed(true);
      } else {
        setQuery("");
      }
    }
  }

  const status = !open
    ? ""
    : indexStatus === "error"
      ? "Sugestões indisponíveis. Pressione Enter para ver os resultados."
      : indexStatus !== "ready"
        ? "Carregando sugestões…"
        : suggestionCount === 0
          ? `Nenhuma sugestão para “${debounced}”. Pressione Enter para pesquisar.`
          : `${suggestionCount} ${suggestionCount === 1 ? "sugestão disponível" : "sugestões disponíveis"}`;

  return (
    <div className={cn("relative", className)}>
      <SearchInput
        id={inputId}
        name="q"
        label={label}
        placeholder={placeholder}
        maxLength={MAX_QUERY_LENGTH}
        autoComplete="off"
        {...(shortcutHint && { shortcutHint })}
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          setDismissed(false);
        }}
        onFocus={() => {
          setFocused(true);
          setDismissed(false);
          loadIndex();
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={showList ? listboxId : undefined}
        aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
        data-search-combobox=""
      />
      <p role="status" className="sr-only">
        {status}
      </p>
      {open && (
        <div
          className={cn(
            "absolute top-full z-40 mt-2 max-h-[min(70vh,28rem)] overflow-y-auto rounded-md border border-border bg-surface p-2 shadow-md motion-safe:animate-pop-in",
            popupClassName,
          )}
        >
          {showList ? (
            <SuggestionList
              id={listboxId}
              groups={groups}
              query={debounced}
              activeIndex={activeIndex}
              optionId={optionId}
              onChoose={choose}
            />
          ) : (
            <p aria-hidden className="px-3 py-2 text-small text-text-muted">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
