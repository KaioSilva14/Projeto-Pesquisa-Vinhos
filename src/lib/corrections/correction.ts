// Sugestão de correção (ADR-031): o formulário só monta uma issue pública no GitHub, que a
// pessoa revisa e envia por lá. Nada é enviado ao Vinum. Sem Zod: este código vai ao navegador.

export const CORRECTION_LIMITS = {
  page: 200,
  problem: { min: 20, max: 1000 },
  source: 300,
} as const;

export type CorrectionValues = { page: string; problem: string; source: string };
export type CorrectionErrors = Partial<Record<keyof CorrectionValues, string>>;

/** Caminho interno do Vinum, como /vinhos/miolo-lote-43 (sem domínio, sem parâmetros). */
const INTERNAL_PATH = /^\/[a-z0-9-/]*$/;

export const isInternalPath = (value: string) =>
  value.length <= CORRECTION_LIMITS.page && INTERNAL_PATH.test(value) && !value.includes("//");

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Mensagens úteis: dizem o que corrigir e como, em vez de só "campo inválido".
 * Objeto vazio = pode enviar.
 */
export function validateCorrection(values: CorrectionValues): CorrectionErrors {
  const errors: CorrectionErrors = {};
  const page = values.page.trim();
  const problem = values.problem.trim();
  const source = values.source.trim();

  if (!page) {
    errors.page = "Informe a página com o erro, por exemplo /vinhos/miolo-lote-43.";
  } else if (!isInternalPath(page)) {
    errors.page =
      "Use o endereço da página no Vinum começando com /, por exemplo /uvas/malbec (sem o domínio).";
  }

  if (problem.length < CORRECTION_LIMITS.problem.min) {
    errors.problem = `Descreva o erro com pelo menos ${CORRECTION_LIMITS.problem.min} caracteres: o que está escrito e o que deveria estar.`;
  } else if (problem.length > CORRECTION_LIMITS.problem.max) {
    errors.problem = `O texto passou de ${CORRECTION_LIMITS.problem.max} caracteres. Resuma o essencial.`;
  }

  if (source && !isHttpsUrl(source)) {
    errors.source =
      "O link da fonte precisa começar com https://. Se não tiver um link, deixe em branco.";
  } else if (source.length > CORRECTION_LIMITS.source) {
    errors.source = `O link passou de ${CORRECTION_LIMITS.source} caracteres.`;
  }
  return errors;
}

/** Endereço de uma issue nova no GitHub, já preenchida com a sugestão. */
export function buildCorrectionIssueUrl(values: CorrectionValues, repositoryUrl: string): string {
  const page = values.page.trim();
  const source = values.source.trim();
  const body = [
    `**Página:** ${page}`,
    "",
    "**O que está errado:**",
    values.problem.trim(),
    "",
    `**Fonte que confirma a correção:** ${source || "não informada"}`,
    "",
    "_Enviado pela página Sugerir uma correção do Vinum._",
  ].join("\n");
  const url = new URL(`${repositoryUrl}/issues/new`);
  url.searchParams.set("title", `Correção de dados: ${page}`);
  url.searchParams.set("body", body);
  return url.toString();
}
