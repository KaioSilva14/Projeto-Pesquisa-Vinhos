import { LinkList } from "@/components/entity/LinkList";
import { FactList } from "@/components/facts/FactList";
import { Cite } from "@/components/sources/Cite";
import type { CitationNumbers } from "@/lib/citations";
import { REGION_LEVEL_LABELS } from "@/lib/labels";
import type { RegionPageData } from "@/lib/places/page-data";

type RegionFactsProps = {
  data: RegionPageData;
  numbers: CitationNumbers;
};

/** Ficha da região: localização, denominação oficial e uvas principais (com a nota da fonte). */
export function RegionFacts({ data, numbers }: RegionFactsProps) {
  const { region, country, parent, grapes } = data;
  const general = region.sourceIds;

  return (
    <FactList
      numbers={numbers}
      facts={[
        country && {
          label: "País",
          value: <LinkList items={[{ name: country.name, href: `/paises/${country.slug}` }]} />,
          sourceIds: general,
        },
        parent && {
          label: "Faz parte de",
          value: <LinkList items={[parent]} />,
          sourceIds: general,
        },
        region.namePt !== undefined && { label: "Nome em português", value: region.namePt },
        region.appellation
          ? {
              label: "Denominação",
              value: `${region.appellation.value.category} · ${region.appellation.value.system}`,
              sourceIds: region.appellation.sourceIds,
            }
          : { label: "Tipo", value: REGION_LEVEL_LABELS[region.level], sourceIds: general },
        region.climate && {
          label: "Clima",
          value: region.climate.value,
          sourceIds: region.climate.sourceIds,
        },
        region.terroir && {
          label: "Solo e relevo",
          value: region.terroir.value,
          sourceIds: region.terroir.sourceIds,
        },
        region.mainGrapeIds &&
          grapes.length > 0 && {
            label: "Uvas principais",
            value: (
              <span className="grid gap-1">
                <span>
                  <LinkList items={grapes} />
                  <Cite ids={region.mainGrapeIds.sourceIds} numbers={numbers} />
                </span>
                {region.mainGrapeIds.notes && (
                  <span className="text-small text-text-muted">{region.mainGrapeIds.notes}</span>
                )}
              </span>
            ),
          },
      ]}
    />
  );
}
