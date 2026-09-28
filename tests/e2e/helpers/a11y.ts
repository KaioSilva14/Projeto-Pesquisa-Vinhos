import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

// Regras WCAG 2.0 a 2.2, níveis A e AA (ACCESSIBILITY.md)
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Falha o teste se o axe encontrar violações sérias ou críticas na página atual. */
export async function expectNoSeriousA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );

  // Mensagem legível: regra + quantos elementos afetados
  const summary = serious.map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);
  expect(summary, "Violações de acessibilidade sérias ou críticas").toEqual([]);
}
