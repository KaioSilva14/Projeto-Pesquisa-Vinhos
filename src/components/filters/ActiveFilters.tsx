import Link from "next/link";

import { ActiveFilterChipLink } from "@/components/ui/Chip";
import {
  FILTER_GROUPS,
  toggleValue,
  winesHref,
  type FilterOptions,
  type FilterSelection,
  type WineSort,
} from "@/lib/filters/wine-filters";

type ActiveFiltersProps = {
  options: FilterOptions;
  selection: FilterSelection;
  sort: WineSort;
};

/** Filtros aplicados, sempre visíveis, cada um removível, e "Limpar tudo" (PRD F02). */
export function ActiveFilters({ options, selection, sort }: ActiveFiltersProps) {
  const chips = FILTER_GROUPS.flatMap((group) =>
    (selection[group.key] ?? []).map((value) => ({
      key: `${group.key}:${value}`,
      label: options[group.key].find((option) => option.value === value)?.label ?? value,
      href: winesHref({ selection: toggleValue(selection, group.key, value), sort }),
    })),
  );
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="sr-only">Filtros aplicados</h2>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.key}>
            <ActiveFilterChipLink href={chip.href} label={chip.label} scroll={false} />
          </li>
        ))}
      </ul>
      <Link
        href={winesHref({ sort })}
        scroll={false}
        className="inline-flex min-h-11 items-center px-2 text-small text-accent underline-offset-4 hover:underline"
      >
        Limpar tudo
      </Link>
    </div>
  );
}
