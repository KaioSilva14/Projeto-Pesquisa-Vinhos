import type { RelatedGroup } from "@/lib/wines/related";

import { WineCard } from "./WineCard";

type RelatedWinesProps = {
  groups: readonly RelatedGroup[];
};

/** "Do mesmo produtor", "Da mesma região", "Produzidos com a mesma uva" (CLAUDE.md §12.7). */
export function RelatedWines({ groups }: RelatedWinesProps) {
  return (
    <div className="grid gap-10">
      {groups.map((group) => (
        <div key={group.key} className="grid gap-4">
          <h3 className="font-semibold">{group.title}</h3>
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((wine) => (
              <li key={wine.id}>
                <WineCard wine={wine} headingLevel="h4" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
