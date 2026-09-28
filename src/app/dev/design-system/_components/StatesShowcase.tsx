import { DemoBadge } from "@/components/states/DemoBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { IncompleteDataNote } from "@/components/states/IncompleteDataNote";
import { NoResults } from "@/components/states/NoResults";
import { Button } from "@/components/ui/Button";
import { HeartIcon } from "@/components/ui/icons";

import { Section } from "./Section";

const panel = "rounded-sm border border-border bg-surface px-4";

// Vitrine dos estados de src/components/states (F1-15). Páginas: /qualquer-coisa mostra a 404.
export function StatesShowcase() {
  return (
    <Section title="Estados">
      <div className="grid gap-6 md:grid-cols-2">
        <div className={panel}>
          <EmptyState
            headingLevel="h3"
            icon={<HeartIcon aria-hidden weight="light" />}
            title="Nenhum favorito ainda"
            description="Salve vinhos, produtores e regiões para encontrá-los aqui depois."
            action={<Button variant="secondary">Explorar vinhos</Button>}
          />
        </div>
        <div className={panel}>
          <NoResults query="exemplo" clearHref="/dev/design-system" />
        </div>
        <div className={panel}>
          <ErrorState headingLevel="h3" action={<Button>Tentar novamente</Button>} />
        </div>
        <div className="grid content-start gap-4">
          <DemoBadge className="justify-self-start" />
          <IncompleteDataNote subject="este vinho" />
        </div>
      </div>
    </Section>
  );
}
