"use client";

import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/Select";
import {
  WINE_SORTS,
  winesHref,
  type FilterSelection,
  type WineSort,
} from "@/lib/filters/wine-filters";

type SortSelectProps = {
  selection: FilterSelection;
  sort: WineSort;
};

const isWineSort = (value: string): value is WineSort =>
  WINE_SORTS.some((sort) => sort.value === value);

/** Ordem da lista; fica na URL (?ordem=safra) junto com os filtros. */
export function SortSelect({ selection, sort }: SortSelectProps) {
  const router = useRouter();

  return (
    <Select
      label="Ordenar por"
      options={WINE_SORTS}
      value={sort}
      onValueChange={(value) => {
        if (isWineSort(value))
          router.push(winesHref({ selection, sort: value }), { scroll: false });
      }}
      className="w-56"
    />
  );
}
