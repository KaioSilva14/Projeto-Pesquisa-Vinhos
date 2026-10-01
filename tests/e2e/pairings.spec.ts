import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F4-06: harmonizações sugeridas pelos produtores

const html = { waitUntil: "domcontentloaded" } as const;
const navigation = { timeout: 15_000 };

test.describe("Harmonizações", () => {
  test("lista os pratos por categoria, com fonte e linguagem de orientação", async ({ page }) => {
    await page.goto("/harmonizacoes", html);
    await expect(page).toHaveTitle("Harmonizações | Vinum");
    await expect(page.getByRole("heading", { level: 2, name: "Carnes" })).toBeVisible();
    await expect(page.getByText(/São orientações, não regras/)).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Fontes" })).toBeVisible();
  });

  test("do vinho para o prato e de volta para o vinho", async ({ page }) => {
    await page.goto("/vinhos/la-rioja-alta-gran-reserva-904", html);
    await expect(page.getByRole("heading", { level: 2, name: "Harmonização" })).toBeVisible();
    await page.getByRole("link", { name: "Sobremesas com chocolate" }).click();
    await expect(page).toHaveURL(/\/harmonizacoes#sobremesas-com-chocolate$/, navigation);
    await page
      .locator("#sobremesas-com-chocolate")
      .getByRole("link", { name: /Gran Reserva 904/ })
      .click();
    await expect(page).toHaveURL(/\/vinhos\/la-rioja-alta-gran-reserva-904$/, navigation);
  });

  test("vinho sem sugestão do produtor não tem a seção", async ({ page }) => {
    await page.goto("/vinhos/chateau-palmer", html);
    await expect(page.getByRole("heading", { name: "Harmonização" })).toHaveCount(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`sem violações sérias de acessibilidade (${colorScheme === "light" ? "claro" : "escuro"})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/harmonizacoes", html);
      await expectNoSeriousA11yViolations(page);
    });
  }
});
