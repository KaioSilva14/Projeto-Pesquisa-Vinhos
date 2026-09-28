import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

test.describe("Home", () => {
  test("carrega com título, idioma e cabeçalho principal", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Vinum/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("heading", { level: 1, name: "Vinum" })).toBeVisible();
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/");

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
      await page.goto("/");

      await expectNoSeriousA11yViolations(page);
    });
  }
});
