import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F4-03: regiões e países

const html = { waitUntil: "domcontentloaded" } as const;
const navigation = { timeout: 15_000 };

test.describe("Regiões e países", () => {
  test("lista de regiões agrupada por país → página da região", async ({ page }) => {
    await page.goto("/regioes", html);
    await expect(page.getByRole("heading", { level: 2, name: "França" })).toBeVisible();
    await page.getByRole("link", { name: "Champagne", exact: true }).click();

    await expect(page).toHaveURL(/\/regioes\/champagne$/, navigation);
    await expect(page).toHaveTitle("Champagne, França: região vinícola | Vinum");
    await expect(page.getByRole("heading", { level: 1, name: "Champagne" })).toBeVisible();
    await expect(page.getByText("AOC ·")).toBeVisible();
  });

  // E2E-05 (TESTING.md), segunda parte: vinho → região → país → vinho
  test("do vinho para a região, dela para o país e de volta a um vinho", async ({ page }) => {
    await page.goto("/vinhos/lagar-de-cervera", html);
    await page.getByRole("link", { name: "Rías Baixas" }).first().click();
    await expect(page).toHaveURL(/\/regioes\/rias-baixas$/, navigation);
    await page.getByRole("link", { name: "Espanha" }).first().click();
    await expect(page).toHaveURL(/\/paises\/espanha$/, navigation);
    await expect(page).toHaveTitle("Vinhos da Espanha | Vinum");
    await page.getByRole("link", { name: "Gran Reserva 904" }).click();
    await expect(page).toHaveURL(/\/vinhos\/la-rioja-alta-gran-reserva-904$/, navigation);
  });

  test("país sem texto próprio mostra o aviso honesto", async ({ page }) => {
    await page.goto("/paises/brasil", html);
    await expect(
      page.getByText("Ainda estamos verificando mais informações sobre este país."),
    ).toBeVisible();
    // A única fonte é a do ponto do mapa (Vale dos Vinhedos), não um texto sobre o país
    await expect(page.locator("#fontes ol > li")).toHaveCount(1);
    await expect(page.locator("#fonte-1")).toContainText("OpenStreetMap: Vale dos Vinhedos");
  });

  test("lista de países", async ({ page }) => {
    await page.goto("/paises", html);
    await expect(
      page.getByRole("list", { name: "Lista de países" }).getByRole("listitem"),
    ).toHaveCount(6);
  });

  test("região e país inexistentes → 404", async ({ page }) => {
    expect((await page.goto("/regioes/atlantida"))?.status()).toBe(404);
    expect((await page.goto("/paises/atlantida"))?.status()).toBe(404);
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    for (const path of ["/regioes", "/regioes/napa-valley", "/paises/estados-unidos"]) {
      await page.goto(path, html);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  for (const colorScheme of ["light", "dark"] as const) {
    for (const path of ["/regioes", "/regioes/bordeaux", "/paises/franca"]) {
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
