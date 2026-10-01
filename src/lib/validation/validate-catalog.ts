import { sensoryLevelFor } from "@/lib/sensory-map";
import { catalogSchemas, type Catalog, type CollectionName } from "@/schemas/catalog";
import type { SensoryProfile } from "@/schemas/wine";

import { checkReferences, type Issue } from "./references";

export type { Issue } from "./references";

type Options = {
  /** true para o catálogo de demonstração (src/data/demo). */
  isDemoSet: boolean;
  /** Data de referência para fontes antigas (padrão: hoje). */
  today?: Date;
};

type Item = { id: string; slug?: string; isDemo?: true };

const collectionNames = (catalog: Catalog) => Object.keys(catalog) as CollectionName[];
const itemsOf = (catalog: Catalog, name: CollectionName) => catalog[name] as Item[];

/** Regras 8 a 12: formato de cada item, conferido pelos schemas Zod. */
function checkSchemas(catalog: Catalog): Issue[] {
  return collectionNames(catalog).flatMap((name) =>
    itemsOf(catalog, name).flatMap((item, index) => {
      const result = catalogSchemas[name].safeParse(item);
      if (result.success) return [];
      const where = `${name}[${item.id ?? index}]`;
      return result.error.issues.map((issue) => ({
        level: "error" as const,
        where,
        message: `${issue.path.join(".") || "(item)"}: ${issue.message}`,
      }));
    }),
  );
}

/** Regra 5: id único e slug único dentro de cada coleção. */
function checkUniqueness(catalog: Catalog): Issue[] {
  const issues: Issue[] = [];
  for (const name of collectionNames(catalog)) {
    for (const key of ["id", "slug"] as const) {
      const seen = new Set<string>();
      for (const item of itemsOf(catalog, name)) {
        const value = item[key];
        if (value === undefined) continue;
        if (seen.has(value)) {
          issues.push({ level: "error", where: name, message: `${key} repetido: ${value}` });
        }
        seen.add(value);
      }
    }
  }
  return issues;
}

/** Regra 6: a hierarquia de regiões não tem ciclos e fica dentro do mesmo país. */
function checkRegionTree(catalog: Catalog): Issue[] {
  const issues: Issue[] = [];
  const byId = new Map(catalog.regions.map((region) => [region.id, region]));
  for (const region of catalog.regions) {
    const where = `regions[${region.id}]`;
    const parent = region.parentId ? byId.get(region.parentId) : undefined;
    if (parent && parent.countryId !== region.countryId) {
      issues.push({ level: "error", where, message: `a região-mãe ${parent.id} é de outro país` });
    }
    const visited = new Set([region.id]);
    for (
      let current = parent;
      current;
      current = current.parentId ? byId.get(current.parentId) : undefined
    ) {
      if (visited.has(current.id)) {
        issues.push({ level: "error", where, message: "a hierarquia de regiões forma um ciclo" });
        break;
      }
      visited.add(current.id);
    }
  }
  return issues;
}

/** Regra 10: dado de demonstração nunca se mistura com dado real. */
function checkDemo(catalog: Catalog, isDemoSet: boolean): Issue[] {
  const withDemoFlag: CollectionName[] = collectionNames(catalog).filter(
    (name) => name !== "sources" && name !== "images",
  );
  return withDemoFlag.flatMap((name) =>
    itemsOf(catalog, name)
      .filter((item) => (item.isDemo === true) !== isDemoSet)
      .map((item) => ({
        level: "error" as const,
        where: `${name}[${item.id}]`,
        message: isDemoSet
          ? "item do catálogo de demonstração sem isDemo: true"
          : "dado de demonstração (isDemo) fora de src/data/demo",
      })),
  );
}

/** Regra 12: nível sensorial só com termo da tabela e no nível que ela define. */
function checkSensory(catalog: Catalog): Issue[] {
  const issues: Issue[] = [];
  for (const wine of catalog.wines) {
    for (const [key, attribute] of Object.entries(wine.sensory ?? {})) {
      if (!attribute) continue;
      const expected = sensoryLevelFor(key as keyof SensoryProfile, attribute.sourceTerm);
      if (expected === undefined) {
        issues.push({
          level: "error",
          where: `wines[${wine.id}]`,
          message: `termo sensorial fora da tabela (${key}): "${attribute.sourceTerm}"`,
        });
      } else if (expected !== attribute.level) {
        issues.push({
          level: "error",
          where: `wines[${wine.id}]`,
          message: `${key}: "${attribute.sourceTerm}" corresponde ao nível ${expected}, não ${attribute.level}`,
        });
      }
    }
  }
  return issues;
}

/** Tamanho mínimo das fotos (IMAGES.md §4): abaixo disso, a foto fica borrada na tela. */
export const MIN_IMAGE_SIZE = {
  /** Garrafa: altura, porque ela é exibida em pé (até ~770 px de altura na página do vinho). */
  bottleHeight: 950,
  /** Demais fotos: lado maior e lado menor. */
  longSide: 1100,
  shortSide: 700,
} as const;

/** Regra 13: foto pequena demais (baixa qualidade) não entra no catálogo. */
function checkImageQuality(catalog: Catalog): Issue[] {
  return catalog.images.flatMap((image) => {
    const long = Math.max(image.width, image.height);
    const short = Math.min(image.width, image.height);
    const tooSmall =
      image.subjectType === "wine"
        ? image.height < MIN_IMAGE_SIZE.bottleHeight
        : long < MIN_IMAGE_SIZE.longSide || short < MIN_IMAGE_SIZE.shortSide;
    if (!tooSmall) return [];
    return [
      {
        level: "error" as const,
        where: `images[${image.id}]`,
        message: `foto pequena demais (${image.width}×${image.height}): procure uma versão maior`,
      },
    ];
  });
}

/** DATA_SOURCES.md §6: fonte consultada há mais de 12 meses gera aviso de revisão. */
function checkStaleSources(catalog: Catalog, today: Date): Issue[] {
  const limit = new Date(today);
  limit.setFullYear(limit.getFullYear() - 1);
  return catalog.sources
    .filter((source) => new Date(source.accessedAt) < limit)
    .map((source) => ({
      level: "warning" as const,
      where: `sources[${source.id}]`,
      message: `consultada em ${source.accessedAt}, há mais de 12 meses: revisar`,
    }));
}

/** Aplica as 14 regras de integridade do DATA_MODEL.md §6. Lista vazia = catálogo válido. */
export function validateCatalog(
  catalog: Catalog,
  { isDemoSet, today = new Date() }: Options,
): Issue[] {
  return [
    ...checkSchemas(catalog),
    ...checkUniqueness(catalog),
    ...checkReferences(catalog),
    ...checkRegionTree(catalog),
    ...checkDemo(catalog, isDemoSet),
    ...checkSensory(catalog),
    ...checkStaleSources(catalog, today),
    ...checkImageQuality(catalog),
  ];
}
