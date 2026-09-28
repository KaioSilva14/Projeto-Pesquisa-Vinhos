export const MAIN_CONTENT_ID = "conteudo";

/**
 * Primeiro elemento focável da página: quem navega pelo teclado pula o cabeçalho com um Tab
 * e um Enter (ACCESSIBILITY.md). Fica escondido até receber foco.
 */
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      // not-sr-only zera o padding, por isso ele é reaplicado junto com o foco
      className="sr-only rounded-sm bg-accent font-medium text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-80 focus:px-4 focus:py-3"
    >
      Pular para o conteúdo
    </a>
  );
}
