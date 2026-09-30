import type { RelatedGroup } from "@/lib/wines/related";

import { WineGrid } from "./WineGrid";

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
          <WineGrid wines={group.items} headingLevel="h4" />
        </div>
      ))}
    </div>
  );
}
