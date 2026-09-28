import { InfoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type IncompleteDataNoteProps = {
  /** Ex.: "este vinho", "esta região". */
  subject: string;
  className?: string;
};

/**
 * Nota discreta quando uma entidade tem poucos dados verificados (DESIGN.md §7.8).
 * Honestidade em vez de preencher campos sem fonte (CLAUDE.md §2.1).
 */
export function IncompleteDataNote({ subject, className }: IncompleteDataNoteProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-sm bg-sunken px-4 py-3 text-small text-text-muted",
        className,
      )}
    >
      <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-info" />
      <span>Ainda estamos verificando mais informações sobre {subject}.</span>
    </p>
  );
}
