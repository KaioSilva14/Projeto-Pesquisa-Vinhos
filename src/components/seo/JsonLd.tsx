type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Dados estruturados (SEO.md §6). Todo sinal de menor vira o código Unicode equivalente,
 * para que nenhum texto dos dados consiga fechar a tag <script> (proteção contra XSS).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
