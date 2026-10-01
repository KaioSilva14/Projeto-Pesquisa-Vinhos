import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/states/EmptyState";
import { buttonVariants } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Obrigado pela sugestão",
  // Página de passagem: não faz sentido nos buscadores
  robots: { index: false, follow: true },
};

/** Agradecimento depois de "Sugerir uma correção" (ADR-031). */
export default function ThanksPage() {
  return (
    <Container>
      <EmptyState
        headingLevel="h1"
        icon={<CheckIcon aria-hidden weight="light" />}
        title="Obrigado pela sugestão"
        description="Falta só um passo: na aba do GitHub que abriu, revise a mensagem e clique em “Create” para enviar. Toda correção é conferida na fonte antes de entrar no Vinum."
        action={
          <>
            <Link href="/explorar" className={buttonVariants()}>
              Continuar explorando
            </Link>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Ir para o início
            </Link>
          </>
        }
      />
    </Container>
  );
}
