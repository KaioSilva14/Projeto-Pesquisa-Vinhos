import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F3-04: página /pesquisa renderizada no servidor (funciona sem JavaScript)
test.describe("Página de pesquisa", () => {
  test("pesquisa com erro de digitação e chega ao resultado certo", async ({ page }) => {
    await page.goto("/pesquisa");
    const main = page.getByRole("main");
    await main.getByRole("combobox").fill("malbek");
    await main.getByRole("button", { name: "Pesquisar" }).click();

    await expect(page).toHaveURL(/\/pesquisa\?q=malbek$/);
    await expect(page).toHaveTitle("Pesquisa: malbek | Vinum");
    await expect(page.getByRole("status").filter({ hasText: "para “malbek”" })).toBeVisible();
    const results = page.getByRole("list", { name: "Resultados da pesquisa" });
    await expect(results.getByRole("link").first()).toHaveAttribute("href", "/uvas/malbec");
  });

  test("filtra por tipo pela URL", async ({ page }) => {
    await page.goto("/pesquisa?q=malbec");
    await page
      .getByRole("navigation", { name: "Filtrar por tipo" })
      .getByRole("link", { name: /Vinhos/ })
      .click();

    await expect(page).toHaveURL(/tipo=vinhos/);
    await expect(page.getByRole("status").filter({ hasText: "em vinhos" })).toBeVisible();
  });

  test("sem resultados mostra a mensagem de ajuda", async ({ page }) => {
    await page.goto("/pesquisa?q=xylofone");
    await expect(
      page.getByRole("status").filter({ hasText: "Nenhum resultado para “xylofone”" }),
    ).toBeVisible();
  });

  test("fica fora dos buscadores", async ({ page }) => {
    await page.goto("/pesquisa?q=tinto");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("funciona sem JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/pesquisa?q=tinto+frances");
    await expect(page.getByRole("link", { name: /^Château Palmer/ })).toBeVisible();
    await context.close();
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/pesquisa?q=tinto");
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
      await page.goto("/pesquisa?q=tinto");
      await expectNoSeriousA11yViolations(page);
    });
  }
});
