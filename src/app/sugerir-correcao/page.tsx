import type { Metadata } from "next";
import { Suspense } from "react";

import { CorrectionForm } from "@/components/corrections/CorrectionForm";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { SITE } from "@/config/site";

const DESCRIPTION =
  "Viu uma informação errada? Conte o que está errado e indique a fonte: toda correção é conferida antes de entrar.";

export const metadata: Metadata = {
  title: "Sugerir uma correção",
  description: DESCRIPTION,
  alternates: { canonical: "/sugerir-correcao" },
};

/** Sugerir correção (ADR-031): monta uma issue pública no GitHub; o Vinum não recebe nada. */
export default function SuggestCorrectionPage() {
  return (
    <>
      <PageHeader
        title="Sugerir uma correção"
        description={DESCRIPTION}
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Sugerir uma correção", href: "/sugerir-correcao" },
        ]}
      />
      <Container className="pb-16">
        <div className="grid max-w-2xl gap-8">
          <noscript>
            <p className="rounded-sm bg-sunken px-4 py-3 text-small text-text-muted">
              Este formulário precisa de JavaScript. Sem ele, abra uma sugestão direto nas{" "}
              <a href={`${SITE.repositoryUrl}/issues/new`} className="text-accent underline">
                issues do repositório no GitHub
              </a>
              .
            </p>
          </noscript>
          {/* Suspense: o endereço da página vem da URL (?pagina=), lida só no navegador */}
          <Suspense fallback={<Skeleton className="h-96" />}>
            <CorrectionForm repositoryUrl={SITE.repositoryUrl} />
          </Suspense>
        </div>
      </Container>
    </>
  );
}
