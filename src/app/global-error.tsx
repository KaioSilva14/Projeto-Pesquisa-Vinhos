"use client";

// Último recurso: substitui até o layout raiz quando ele próprio falha. Por isso precisa
// de <html> e <body> próprios e não usa cabeçalho, rodapé nem outros componentes do site.

import { hankenGrotesk, newsreader } from "@/styles/fonts";
import "@/styles/globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function GlobalError({ retry }: GlobalErrorProps) {
  return (
    <html lang="pt-BR" className={`${newsreader.variable} ${hankenGrotesk.variable}`}>
      <body className="grid min-h-dvh place-items-center p-6">
        {/* metadata não funciona aqui; o React aceita <title> direto */}
        <title>Erro | Vinum</title>
        <main className="grid max-w-lead justify-items-center gap-4 text-center">
          <h1 className="font-serif text-h2">Algo deu errado</h1>
          <p className="text-body text-text-muted">
            O site não conseguiu carregar. Tente novamente em instantes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="h-11 rounded-sm bg-accent px-5 font-medium text-on-accent"
            >
              Tentar novamente
            </button>
            {/* <a> em vez de <Link>: recarrega a página inteira, sem depender do app quebrado */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- ver comentário acima */}
            <a
              href="/"
              className="inline-flex h-11 items-center rounded-sm border border-border-strong px-5 font-medium"
            >
              Ir para o início
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
