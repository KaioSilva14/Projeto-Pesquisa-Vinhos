import { Cite } from "@/components/sources/Cite";
import { cn } from "@/lib/cn";
import type { CitationNumbers } from "@/lib/citations";
import type { SensoryProfile as SensoryProfileData } from "@/schemas/wine";

const ATTRIBUTES = [
  { key: "body", label: "Corpo" },
  { key: "acidity", label: "Acidez" },
  { key: "tannins", label: "Taninos" },
  { key: "sweetness", label: "Doçura" },
  { key: "aromaIntensity", label: "Intensidade aromática" },
] as const;

type SensoryProfileProps = {
  profile: SensoryProfileData | undefined;
  numbers: CitationNumbers;
};

/**
 * Perfil sensorial (DESIGN.md §7.8, ACCESSIBILITY.md §3.3): 5 segmentos + o termo exato da fonte.
 * Atributo sem fonte não existe nos dados, então não aparece; sem nenhum, o bloco some.
 */
export function SensoryProfile({ profile, numbers }: SensoryProfileProps) {
  const entries = ATTRIBUTES.flatMap(({ key, label }) => {
    const attribute = profile?.[key];
    return attribute ? [{ key, label, attribute }] : [];
  });
  if (entries.length === 0) return null;

  return (
    <dl className="grid gap-4">
      {entries.map(({ key, label, attribute }) => (
        <div key={key} className="grid gap-1.5 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-4">
          <dt className="text-small text-text-muted">{label}</dt>
          <dd className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span aria-hidden className="flex gap-1">
              {[1, 2, 3, 4, 5].map((segment) => (
                <span
                  key={segment}
                  className={cn(
                    "h-2 w-8 rounded-pill",
                    segment <= attribute.level ? "bg-accent" : "bg-sunken",
                  )}
                />
              ))}
            </span>
            <span>
              {attribute.sourceTerm}
              <span className="text-text-muted"> ({attribute.level} de 5)</span>
              <Cite ids={attribute.sourceIds} numbers={numbers} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
