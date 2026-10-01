import type { Page } from "@playwright/test";

import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F3-05/F3-06: lista de vinhos com filtros na URL

// Recarregar/voltar esperam só o HTML: filtros e resultados já vêm prontos do servidor, e as
// fotos (1ª com prioridade) podem demorar no servidor frio do CI
const html = { waitUntil: "domcontentloaded" } as const;

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1024;
const results = (page: Page) =>
  page.getByRole("list", { name: "Lista de vinhos" }).getByRole("heading", { level: 2 });

test.describe("Lista de vinhos", () => {
  // E2E-03 (TESTING.md)
  test("3 filtros na URL; recarregar mantém; voltar remove o último", async ({ page }) => {
    test.skip(!isDesktop(page), "painel lateral só no desktop (celular: teste do painel inferior)");
    await page.goto("/vinhos");
    const filters = page.getByRole("main");

    await filters.getByRole("checkbox", { name: /^Tinto/ }).click();
    await expect(page).toHaveURL(/tipo=tinto/);
    await filters.getByRole("checkbox", { name: /^Itália/ }).click();
    await expect(page).toHaveURL(/pais=italia/);
    await filters.getByRole("checkbox", { name: /^Nebbiolo/ }).click();
    await expect(page).toHaveURL(/\/vinhos\?tipo=tinto&pais=italia&uva=nebbiolo$/);
    await expect(results(page)).toHaveCount(2);

    await page.reload(html);
    await expect(filters.getByRole("checkbox", { name: /^Nebbiolo/ })).toBeChecked();
    await expect(results(page)).toHaveCount(2);

    await page.goBack(html);
    await expect(page).toHaveURL(/\/vinhos\?tipo=tinto&pais=italia$/);
    await expect(filters.getByRole("checkbox", { name: /^Nebbiolo/ })).not.toBeChecked();
  });

  // E2E-04 (TESTING.md)
  test("celular: painel inferior → aplicar → chips → limpar tudo", async ({ page }) => {
    test.skip(isDesktop(page), "painel inferior só abaixo de 1024 px");
    await page.goto("/vinhos");

    await page.getByRole("button", { name: "Filtros" }).click();
    const sheet = page.getByRole("dialog", { name: "Filtros" });
    await sheet.getByRole("checkbox", { name: /^Branco/ }).click();
    await sheet.getByRole("button", { name: /^Ver \d+ vinhos?$/ }).click();

    await expect(page).toHaveURL(/tipo=branco/);
    await expect(page.getByRole("link", { name: "Remover filtro: Branco" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Filtros (1)" })).toBeVisible();

    await page.getByRole("link", { name: "Limpar tudo" }).click();
    await expect(page).toHaveURL(/\/vinhos$/);
    await expect(page.getByRole("link", { name: /Remover filtro/ })).toHaveCount(0);
  });

  test("ordenar por safra muda a URL e a ordem", async ({ page }) => {
    await page.goto("/vinhos");
    await page.getByRole("combobox", { name: "Ordenar por" }).click();
    await page.getByRole("option", { name: "Safra mais recente" }).click();
    await expect(page).toHaveURL(/ordem=safra/);
    // A safra mais recente do catálogo é a de 2025 (Lagar de Cervera)
    await expect(results(page).first()).toHaveText("Lagar de Cervera");
  });

  test("filtro que não existe nos dados é ignorado", async ({ page }) => {
    await page.goto("/vinhos?pais=atlantida");
    await expect(page.getByRole("link", { name: /Remover filtro/ })).toHaveCount(0);
    await expect(page.getByRole("status").filter({ hasText: /^\d+ vinhos$/ })).toBeVisible();
  });

  // E2E-10 (TESTING.md)
  test("funciona sem JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    // Só o HTML: sem JavaScript, Chromium e Firefox ignoram o loading="lazy" e baixam todas as
    // fotos de uma vez; com o servidor frio (CI), o evento "load" passaria do tempo limite
    await page.goto("/vinhos?tipo=espumante", { waitUntil: "domcontentloaded" });
    await expect(results(page)).toHaveCount(2);
    await expect(page.getByRole("link", { name: "Remover filtro: Espumante" })).toBeVisible();
    await context.close();
  });

  test("lista filtrada fica fora dos buscadores; a lista base não", async ({ page }) => {
    await page.goto("/vinhos?tipo=tinto");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await page.goto("/vinhos");
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/vinhos$/);
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/vinhos?tipo=tinto");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`não tem violações sérias de acessibilidade no tema ${colorScheme === "light" ? "claro" : "escuro"}`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/vinhos?tipo=tinto");
      await expectNoSeriousA11yViolations(page);
    });
  }
});
