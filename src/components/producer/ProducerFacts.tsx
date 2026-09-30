import { LinkList } from "@/components/entity/LinkList";
import { FactList } from "@/components/facts/FactList";
import type { CitationNumbers } from "@/lib/citations";
import { formatList } from "@/lib/format";
import type { ProducerPageData } from "@/lib/producers/page-data";

const linkClass = "underline decoration-border-strong underline-offset-4 hover:decoration-accent";

type ProducerFactsProps = {
  data: ProducerPageData;
  numbers: CitationNumbers;
};

/** Ficha do produtor: só o que as fichas técnicas e páginas oficiais informam. */
export function ProducerFacts({ data, numbers }: ProducerFactsProps) {
  const { producer, country, regions } = data;
  const general = producer.sourceIds;
  const city = producer.location?.value.city;

  return (
    <FactList
      numbers={numbers}
      facts={[
        country && {
          label: "País",
          value: <LinkList items={[{ name: country.name, href: `/paises/${country.slug}` }]} />,
          sourceIds: general,
        },
        regions.length > 0 && {
          label: regions.length === 1 ? "Região" : "Regiões",
          value: <LinkList items={regions} />,
          sourceIds: general,
        },
        producer.foundedYear && {
          label: "Fundação",
          value: String(producer.foundedYear.value),
          sourceIds: producer.foundedYear.sourceIds,
        },
        city !== undefined && {
          label: "Cidade",
          value: city,
          sourceIds: producer.location?.sourceIds,
        },
        producer.officialWebsite && {
          label: "Site oficial",
          value: (
            <a
              href={producer.officialWebsite.value}
              rel="noopener noreferrer"
              className={linkClass}
            >
              {new URL(producer.officialWebsite.value).hostname.replace(/^www\./, "")}
            </a>
          ),
          sourceIds: producer.officialWebsite.sourceIds,
        },
        producer.certifications && {
          label: "Certificações",
          value: formatList(producer.certifications.value),
          sourceIds: producer.certifications.sourceIds,
        },
      ]}
    />
  );
}
