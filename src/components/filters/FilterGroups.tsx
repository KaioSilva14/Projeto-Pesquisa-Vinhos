"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import {
  FILTER_GROUPS,
  facetCounts,
  type FacetRecord,
  type FilterKey,
  type FilterOptions,
  type FilterSelection,
} from "@/lib/filters/wine-filters";

type FilterGroupsProps = {
  records: readonly FacetRecord[];
  options: FilterOptions;
  selection: FilterSelection;
  onToggle: (key: FilterKey, value: string) => void;
};

/**
 * Grupos de filtro com caixas de seleção e contagem (ACCESSIBILITY.md §3.2). Só aparecem
 * opções que trazem algum vinho (ou que já estão marcadas).
 */
export function FilterGroups({ records, options, selection, onToggle }: FilterGroupsProps) {
  return (
    <div className="grid gap-6">
      {FILTER_GROUPS.map((group) => {
        const counts = facetCounts(records, selection, group.key);
        const chosen = selection[group.key] ?? [];
        const visible = options[group.key].filter(
          (option) => (counts.get(option.value) ?? 0) > 0 || chosen.includes(option.value),
        );
        if (visible.length === 0) return null;

        return (
          <fieldset key={group.key}>
            <legend className="mb-1 text-small font-semibold">{group.label}</legend>
            {visible.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                count={counts.get(option.value) ?? 0}
                checked={chosen.includes(option.value)}
                onCheckedChange={() => onToggle(group.key, option.value)}
              />
            ))}
          </fieldset>
        );
      })}
    </div>
  );
}
