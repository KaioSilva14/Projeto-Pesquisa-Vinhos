import Link from "next/link";

import { Section } from "@/components/layout/Section";
import { EntityImage } from "@/components/media/EntityImage";
import type { RegionGroup } from "@/lib/places/page-data";
import type { ImageAsset } from "@/schemas/image-asset";

export type FeaturedRegion = {
  name: string;
  href: string;
  /** Resumo próprio da região, com fonte na página dela. */
  summary?: string;
  image?: ImageAsset;
};

type RegionShowcaseProps = {
  featured: FeaturedRegion;
  groups: readonly RegionGroup[];
};

const linkClass = "underline-offset-4 hover:text-accent hover:underline";

/** "Regiões" (DESIGN.md §8): uma foto grande em destaque e a lista de todas, por país. */
export function RegionShowcase({ featured, groups }: RegionShowcaseProps) {
  return (
    <Section title="Regiões" rhythm="editorial">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="grid content-start gap-4">
          <EntityImage
            image={featured.image}
            variant="landscape"
            sizes="(min-width: 1024px) 55vw, 100vw"
            showCredit
          />
          <h3 className="font-serif text-h3">
            <Link href={featured.href} className={linkClass}>
              {featured.name}
            </Link>
          </h3>
          {featured.summary && <p className="max-w-prose text-text-muted">{featured.summary}</p>}
        </div>

        <div className="grid content-start gap-6">
          {groups.map((group) => (
            <div key={group.country.href} className="grid gap-1">
              <h3 className="text-small font-semibold">
                <Link href={group.country.href} className={linkClass}>
                  {group.country.name}
                </Link>
              </h3>
              <ul className="grid">
                {group.regions.map((region) => (
                  <li key={region.id}>
                    <Link
                      href={region.href}
                      className="flex min-h-11 items-baseline justify-between gap-4 border-b border-border py-2 hover:text-accent"
                    >
                      <span className="font-serif text-h4">{region.name}</span>
                      {region.context && (
                        <span className="text-small text-text-muted">{region.context}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
