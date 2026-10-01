import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F4-04: produtores

const html = { waitUntil: "domcontentloaded" } as const;
const navigation = { timeout: 15_000 };

test.describe("Produtores", () => {
  test("lista → página do produtor com ficha, vinhos e fontes", async ({ page }) => {
    await page.goto("/produtores", html);
    await expect(
      page.getByRole("list", { name: "Lista de produtores" }).getByRole("listitem"),
    ).toHaveCount(7);
    await page.getByRole("link", { name: "Chateau Montelena", exact: true }).click();

    await expect(page).toHaveURL(/\/produtores\/chateau-montelena$/, navigation);
    await expect(page).toHaveTitle("Chateau Montelena: produtor em Napa Valley | Vinum");
    await expect(page.getByText("1882")).toBeVisible();
    await expect(page.getByRole("link", { name: "montelena.com" })).toHaveAttribute(
      "href",
      "https://montelena.com",
    );
  });

  // E2E-05 (TESTING.md) completo: vinho → uva → região → produtor → vinho
  test("navegação entre entidades", async ({ page }) => {
    await page.goto("/vinhos/catena-malbec", html);
    await page.getByRole("link", { name: "Malbec", exact: true }).first().click();
    await expect(page).toHaveURL(/\/uvas\/malbec$/, navigation);
    await page.getByRole("link", { name: "Mendoza" }).first().click();
    await expect(page).toHaveURL(/\/regioes\/mendoza$/, navigation);
    await page.getByRole("link", { name: "Bodega Catena Zapata" }).first().click();
    await expect(page).toHaveURL(/\/produtores\/catena-zapata$/, navigation);
    await page.getByRole("link", { name: "Catena Zapata Malbec Argentino", exact: true }).click();
    await expect(page).toHaveURL(/\/vinhos\/catena-zapata-malbec-argentino$/, navigation);
  });

  test("produtor com história não mostra o aviso de dados incompletos", async ({ page }) => {
    await page.goto("/produtores/miolo", html);
    await expect(page.getByRole("heading", { level: 2, name: "História" })).toBeVisible();
    await expect(page.getByText(/Ainda estamos verificando/)).toHaveCount(0);
  });

  test("produtor inexistente → 404", async ({ page }) => {
    expect((await page.goto("/produtores/nao-existe"))?.status()).toBe(404);
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/produtores/la-rioja-alta", html);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    for (const path of ["/produtores", "/produtores/miolo"]) {
      test(`${path} sem violações sérias de acessibilidade (${colorScheme === "light" ? "claro" : "escuro"})`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme });
        await page.goto(path, html);
        await expectNoSeriousA11yViolations(page);
      });
    }
  }
});
