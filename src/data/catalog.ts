import type { Catalog } from "@/schemas/catalog";

import { countries } from "./countries";
import { grapes } from "./grapes";
import { images } from "./images";
import { pairings } from "./pairings";
import { producers } from "./producers";
import { regions } from "./regions";
import { sources } from "./sources";
import { styles } from "./styles";
import { vintages } from "./vintages";
import { wineries } from "./wineries";
import { wines } from "./wines";

/**
 * Catálogo real: só dados verificados, com fonte (CLAUDE.md §2.1).
 * Validado por `npm run validate:data` (scripts/validate-data.ts) no CI.
 */
export const catalog: Catalog = {
  sources,
  images,
  countries,
  regions,
  grapes,
  producers,
  wineries,
  styles,
  wines,
  vintages,
  pairings,
};
