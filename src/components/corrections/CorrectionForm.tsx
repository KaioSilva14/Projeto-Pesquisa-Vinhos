"use client";

// Client Component: valida enquanto a pessoa preenche e abre a issue do GitHub numa nova aba.

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { WarningCircleIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  buildCorrectionIssueUrl,
  CORRECTION_LIMITS,
  isInternalPath,
  validateCorrection,
  type CorrectionErrors,
  type CorrectionValues,
} from "@/lib/corrections/correction";

const FIELD_LABELS: Record<keyof CorrectionValues, string> = {
  page: "Página com o erro",
  problem: "O que está errado?",
  source: "Fonte que confirma a correção (opcional)",
};

type CorrectionFormProps = { repositoryUrl: string };

export function CorrectionForm({ repositoryUrl }: CorrectionFormProps) {
  const router = useRouter();
  // "Sugerir correção" numa página de vinho já traz o endereço dela (?pagina=/vinhos/...)
  const fromPage = useSearchParams().get("pagina") ?? "";
  const [values, setValues] = useState<CorrectionValues>({
    page: isInternalPath(fromPage) ? fromPage : "",
    problem: "",
    source: "",
  });
  const [errors, setErrors] = useState<CorrectionErrors>({});
  const [blockedUrl, setBlockedUrl] = useState<string>();
  const summaryRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof CorrectionValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // O erro do campo some assim que a pessoa começa a corrigir
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateCorrection(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Resumo dos erros recebe o foco: leitor de tela anuncia o que corrigir (WCAG 3.3.1)
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const url = buildCorrectionIssueUrl(values, repositoryUrl);
    const opened = window.open(url, "_blank");
    if (!opened) {
      // Bloqueador de janelas: em vez de falhar em silêncio, oferece o link
      setBlockedUrl(url);
      return;
    }
    opened.opener = null;
    router.push("/sugerir-correcao/obrigado");
  }

  const errorList = (Object.keys(errors) as (keyof CorrectionValues)[]).filter(
    (field) => errors[field],
  );

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-6">
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="grid gap-2 rounded-sm border border-danger px-4 py-3 text-small focus:outline-none"
        >
          <p className="flex items-center gap-1.5 font-semibold text-danger">
            <WarningCircleIcon aria-hidden className="size-4 shrink-0" />
            {errorList.length === 1
              ? "Falta corrigir 1 campo para continuar:"
              : `Faltam corrigir ${errorList.length} campos para continuar:`}
          </p>
          <ul className="list-disc pl-5 text-text-muted">
            {errorList.map((field) => (
              <li key={field}>
                {FIELD_LABELS[field]}: {errors[field]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Input
        label={FIELD_LABELS.page}
        name="pagina"
        value={values.page}
        onChange={(event) => update("page")(event.target.value)}
        maxLength={CORRECTION_LIMITS.page}
        hint="O endereço da página no Vinum, por exemplo /vinhos/miolo-lote-43."
        autoComplete="off"
        spellCheck={false}
        {...(errors.page && { error: errors.page })}
      />
      <Textarea
        label={FIELD_LABELS.problem}
        name="problema"
        value={values.problem}
        onChange={(event) => update("problem")(event.target.value)}
        maxLength={CORRECTION_LIMITS.problem.max}
        hint={`O que está escrito e o que deveria estar. Mínimo de ${CORRECTION_LIMITS.problem.min} caracteres.`}
        {...(errors.problem && { error: errors.problem })}
      />
      <Input
        label={FIELD_LABELS.source}
        name="fonte"
        type="url"
        inputMode="url"
        value={values.source}
        onChange={(event) => update("source")(event.target.value)}
        maxLength={CORRECTION_LIMITS.source}
        hint="Link da ficha técnica, do site do produtor ou de um órgão oficial."
        placeholder="https://"
        {...(errors.source && { error: errors.source })}
      />

      <div className="grid justify-items-start gap-3">
        <Button type="submit" size="lg">
          Continuar no GitHub
        </Button>
        <p className="text-small text-text-subtle">
          Abre uma nova aba com a mensagem pronta. Para enviar, é preciso entrar com uma conta do
          GitHub. A mensagem fica pública.
        </p>
      </div>

      {blockedUrl && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-sm bg-sunken px-4 py-3 text-small text-text-muted"
        >
          <WarningCircleIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
          <span>
            O navegador bloqueou a nova aba. Abra a mensagem por este link:{" "}
            <a
              href={blockedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              continuar no GitHub
            </a>
            .
          </span>
        </p>
      )}
    </form>
  );
}
