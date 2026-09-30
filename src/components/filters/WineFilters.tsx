"use client";

// Client Component: marcar um filtro muda a URL, e o servidor devolve a lista filtrada.

import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

import { Button } from "@/components/ui/Button";
import { FunnelSimpleIcon } from "@/components/ui/icons";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import {
  applyFilters,
  countSelected,
  toggleValue,
  winesHref,
  type FacetRecord,
  type FilterOptions,
  type FilterSelection,
  type WineSort,
} from "@/lib/filters/wine-filters";

import { FilterGroups } from "./FilterGroups";

type WineFiltersProps = {
  records: readonly FacetRecord[];
  options: FilterOptions;
  selection: FilterSelection;
  sort: WineSort;
};

const vinhos = (count: number) => (count === 1 ? "1 vinho" : `${count} vinhos`);

/**
 * Desktop: painel lateral que aplica cada filtro na hora. Celular: botão "Filtros" que abre um
 * painel inferior; as escolhas só valem ao tocar em "Ver N vinhos" (DESIGN.md §12).
 */
export function WineFilters({ records, options, selection, sort }: WineFiltersProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  // Mostra a caixa marcada na hora, enquanto o servidor prepara a lista nova
  const [shown, setShown] = useOptimistic(selection);
  const [draft, setDraft] = useState<FilterSelection>(selection);
  const [sheetOpen, setSheetOpen] = useState(false);

  function apply(next: FilterSelection) {
    startTransition(() => {
      setShown(next);
      // Filtro novo volta à primeira "página" da lista
      router.push(winesHref({ selection: next, sort }), { scroll: false });
    });
  }

  const activeCount = countSelected(selection);
  const draftCount = applyFilters(records, draft).length;

  return (
    <>
      <div className="hidden lg:block">
        <h2 className="sr-only">Filtros</h2>
        <FilterGroups
          records={records}
          options={options}
          selection={shown}
          onToggle={(key, value) => apply(toggleValue(shown, key, value))}
        />
      </div>

      <div className="lg:hidden">
        <Sheet
          open={sheetOpen}
          onOpenChange={(open) => {
            if (open) setDraft(selection); // começa das escolhas já aplicadas
            setSheetOpen(open);
          }}
        >
          <SheetTrigger asChild>
            <Button variant="secondary">
              <FunnelSimpleIcon aria-hidden />
              Filtros{activeCount > 0 && ` (${activeCount})`}
            </Button>
          </SheetTrigger>
          <SheetContent
            title="Filtros"
            footer={
              <>
                <Button variant="secondary" onClick={() => setDraft({})}>
                  Limpar
                </Button>
                <Button
                  className="flex-1"
                  disabled={draftCount === 0}
                  onClick={() => {
                    setSheetOpen(false);
                    apply(draft);
                  }}
                >
                  {draftCount === 0 ? "Nenhum vinho" : `Ver ${vinhos(draftCount)}`}
                </Button>
              </>
            }
          >
            <FilterGroups
              records={records}
              options={options}
              selection={draft}
              onToggle={(key, value) => setDraft((current) => toggleValue(current, key, value))}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
