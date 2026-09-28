import type { Catalog, CollectionName } from "@/schemas/catalog";

// Regras de referência do DATA_MODEL.md §6: fontes (1), imagens (2) e chaves estrangeiras (4).

export type Issue = { level: "error" | "warning"; where: string; message: string };

type Ref = { field: string; target: CollectionName; ids: readonly string[] };
type Item = { id: string };

const idsOf = (value: { value: readonly string[] } | undefined) => value?.value ?? [];
const one = (id: string | undefined) => (id ? [id] : []);

/** Para cada coleção, quais campos apontam para quais outras coleções. */
const referencesOf: { [K in CollectionName]?: (item: Catalog[K][number]) => Ref[] } = {
  regions: (r) => [
    { field: "countryId", target: "countries", ids: [r.countryId] },
    { field: "parentId", target: "regions", ids: one(r.parentId) },
    { field: "mainGrapeIds", target: "grapes", ids: idsOf(r.mainGrapeIds) },
    { field: "mainStyleIds", target: "styles", ids: idsOf(r.mainStyleIds) },
  ],
  grapes: (g) => [
    { field: "mainRegionIds", target: "regions", ids: idsOf(g.mainRegionIds) },
    { field: "styleIds", target: "styles", ids: idsOf(g.styleIds) },
  ],
  producers: (p) => [
    { field: "countryId", target: "countries", ids: [p.countryId] },
    { field: "regionIds", target: "regions", ids: p.regionIds ?? [] },
  ],
  wineries: (w) => [
    { field: "producerId", target: "producers", ids: [w.producerId] },
    { field: "regionId", target: "regions", ids: one(w.regionId) },
  ],
  wines: (w) => [
    { field: "producerId", target: "producers", ids: [w.producerId] },
    { field: "wineryId", target: "wineries", ids: one(w.wineryId) },
    { field: "countryId", target: "countries", ids: [w.countryId] },
    { field: "regionId", target: "regions", ids: one(w.regionId) },
    { field: "styleId", target: "styles", ids: one(w.styleId) },
    { field: "grapes", target: "grapes", ids: w.grapes?.value.map((g) => g.grapeId) ?? [] },
    { field: "pairingIds", target: "pairings", ids: idsOf(w.pairingIds) },
  ],
  vintages: (v) => [
    { field: "wineId", target: "wines", ids: [v.wineId] },
    { field: "grapes", target: "grapes", ids: v.grapes?.value.map((g) => g.grapeId) ?? [] },
  ],
  pairings: (p) => [
    { field: "relatedGrapeIds", target: "grapes", ids: idsOf(p.relatedGrapeIds) },
    { field: "relatedStyleIds", target: "styles", ids: idsOf(p.relatedStyleIds) },
  ],
};

/** Coleções cujas fotos precisam ser da própria entidade (IMAGES.md §2). */
const imageSubjectOf: Partial<Record<CollectionName, string>> = {
  wines: "wine",
  producers: "producer",
  wineries: "winery",
  regions: "region",
  grapes: "grape",
};

function eachItem(catalog: Catalog, visit: (name: CollectionName, item: Item) => void) {
  for (const name of Object.keys(catalog) as CollectionName[]) {
    for (const item of catalog[name] as Item[]) visit(name, item);
  }
}

/** Percorre o objeto inteiro atrás de `sourceIds` e `basedOnSourceIds`. */
function collectSourceIds(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) value.forEach((entry) => collectSourceIds(entry, found));
  else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if ((key === "sourceIds" || key === "basedOnSourceIds") && Array.isArray(entry)) {
        entry.forEach((id) => typeof id === "string" && found.add(id));
      } else collectSourceIds(entry, found);
    }
  }
  return found;
}

export function checkReferences(catalog: Catalog): Issue[] {
  const issues: Issue[] = [];
  const idSets = Object.fromEntries(
    (Object.keys(catalog) as CollectionName[]).map((name) => [
      name,
      new Set((catalog[name] as Item[]).map((item) => item.id)),
    ]),
  ) as Record<CollectionName, Set<string>>;
  const imagesById = new Map(catalog.images.map((image) => [image.id, image]));

  eachItem(catalog, (name, item) => {
    const where = `${name}[${item.id}]`;

    // Regra 1: toda fonte citada existe
    for (const sourceId of collectSourceIds(item)) {
      if (!idSets.sources.has(sourceId)) {
        issues.push({ level: "error", where, message: `fonte inexistente: ${sourceId}` });
      }
    }

    // Regra 4: toda chave estrangeira existe
    const getRefs = referencesOf[name] as ((entry: Item) => Ref[]) | undefined;
    for (const ref of getRefs?.(item) ?? []) {
      for (const id of ref.ids) {
        if (!idSets[ref.target].has(id)) {
          issues.push({
            level: "error",
            where,
            message: `${ref.field} aponta para ${ref.target} inexistente: ${id}`,
          });
        }
      }
    }

    // Regra 2: imagens existem e são da própria entidade
    const imageIds = (item as { imageIds?: string[] }).imageIds ?? [];
    for (const imageId of imageIds) {
      const image = imagesById.get(imageId);
      if (!image) {
        issues.push({ level: "error", where, message: `imagem inexistente: ${imageId}` });
      } else if (image.subjectType !== "ambient") {
        const expected = imageSubjectOf[name];
        if (image.subjectType !== expected || image.subjectId !== item.id) {
          issues.push({
            level: "error",
            where,
            message: `a imagem ${imageId} é de ${image.subjectType}:${image.subjectId ?? "?"}, não desta entidade`,
          });
        }
      }
    }
  });

  return issues;
}
