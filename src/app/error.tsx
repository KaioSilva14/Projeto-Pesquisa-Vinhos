"use client";

// Páginas de erro precisam ser Client Components: o React só captura erros no navegador.

import Link from "next/link";
import { useEffect } from "react";

import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/states/ErrorState";
import { Button, buttonVariants } from "@/components/ui/Button";
import { ArrowClockwiseIcon } from "@/components/ui/icons";
import { SITE } from "@/config/site";

type ErrorPageProps = {
  // `digest` identifica o erro nos logs do servidor sem expor detalhes ao visitante
  error: Error & { digest?: string };
  /** Next 16: tenta carregar a página de novo (versões antigas chamavam de `reset`). */
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Registro no console do navegador; um serviço de monitoramento pode entrar aqui (fase 10)
    console.error(error);
  }, [error]);

  return (
    <Container>
      <ErrorState
        headingLevel="h1"
        title="Algo deu errado"
        description="Não foi possível carregar esta página. Pode ser uma falha temporária: espere alguns segundos e tente de novo. Se estiver sem internet, verifique a conexão."
        action={
          <>
            <Button onClick={() => retry()}>
              <ArrowClockwiseIcon aria-hidden className="size-5" />
              Tentar novamente
            </Button>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Ir para o início
            </Link>
            {/* Mensagem útil: se o erro continuar, quem avisar já informa o código */}
            <p className="w-full text-small text-text-subtle">
              Continua dando erro?{" "}
              <a
                href={`${SITE.repositoryUrl}/issues`}
                className="underline underline-offset-4 hover:text-text"
              >
                Avise sobre o problema
              </a>
              {error.digest && (
                <>
                  {" "}
                  informando o código <code className="font-mono">{error.digest}</code>
                </>
              )}
              .
            </p>
          </>
        }
      />
    </Container>
  );
}
