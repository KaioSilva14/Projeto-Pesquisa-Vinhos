import type { WineListItem } from "@/lib/wines/list-item";

import { WineCard } from "./WineCard";

type WineGridProps = {
  wines: readonly WineListItem[];
  /** Nome da lista para leitores de tela, ex.: "Lista de vinhos". */
  label?: string;
  headingLevel?: "h2" | "h3" | "h4";
};

/**
 * Grade de cards de vinho. Se algum vinho tem foto da garrafa, todos reservam a área (os sem
 * foto mostram "Imagem indisponível"); se nenhum tem, os cards ficam só com texto.
 */
export function WineGrid({ wines, label, headingLevel = "h2" }: WineGridProps) {
  const reserveImage = wines.some((wine) => wine.image);

  return (
    <ul aria-label={label} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {wines.map((wine) => (
        <li key={wine.id}>
          <WineCard wine={wine} headingLevel={headingLevel} reserveImage={reserveImage} />
        </li>
      ))}
    </ul>
  );
}
