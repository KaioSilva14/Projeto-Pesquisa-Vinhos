import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F4-02: lista de uvas e página de cada uva.
// Páginas com foto esperam só o HTML ("domcontentloaded"): a primeira otimização de cada tamanho
// de foto é lenta com o servidor frio (CI) e não deve decidir se o teste passa.
const html = { waitUntil: "domcontentloaded" } as const;
// Navegação por clique: margem para o servidor ocupado otimizando fotos
const navigation = { timeout: 15_000 };

test.describe("Uvas", () => {
  test("lista → card → página da uva, com foto e crédito", async ({ page }) => {
    await page.goto("/uvas", html);
    await expect(
      page.getByRole("list", { name: "Lista de uvas" }).getByRole("listitem"),
    ).toHaveCount(10);
    await page.getByRole("link", { name: "Nebbiolo", exact: true }).click();

    await expect(page).toHaveURL(/\/uvas\/nebbiolo$/, navigation);
    await expect(page).toHaveTitle("Nebbiolo: uva, origem e vinhos | Vinum");
    await expect(page.getByRole("heading", { level: 1, name: "Nebbiolo" })).toBeVisible();
    await expect(page.getByText(/Foto: .*Julius Kühn-Institut/)).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Vinhos com esta uva" }),
    ).toBeVisible();
  });

  test("crédito da foto no card abre no botão Créditos", async ({ page }) => {
    await page.goto("/uvas", html);
    const button = page.getByRole("button", { name: /Créditos da foto/ }).first();
    const dialog = page.getByRole("dialog");
    // Antes de a página ativar o JavaScript, o botão ainda não abre: repete o clique
    await expect(async () => {
      if (!(await dialog.isVisible())) await button.click();
      await expect(dialog).toBeVisible({ timeout: 1_000 });
    }).toPass(navigation);
    await expect(dialog).toContainText("Julius Kühn-Institut");
  });

  // E2E-05 (TESTING.md), primeira parte: vinho → uva → vinho
  test("do vinho para a uva e de volta para outro vinho", async ({ page }) => {
    await page.goto("/vinhos/vajra-barolo-albe");
    await page.getByRole("link", { name: "Nebbiolo" }).first().click();
    await expect(page).toHaveURL(/\/uvas\/nebbiolo$/, navigation);
    await page.getByRole("link", { name: "Barolo Bricco delle Viole" }).click();
    await expect(page).toHaveURL(/\/vinhos\/vajra-barolo-bricco-delle-viole$/, navigation);
  });

  test("Torrontés Riojano: foto do INV com crédito; sem vinhos no catálogo", async ({ page }) => {
    await page.goto("/uvas/torrontes-riojano", html);
    await expect(page.getByText(/Foto: Instituto Nacional de Vitivinicultura/)).toBeVisible();
    await expect(page.getByText("Ainda não há vinhos com esta uva no catálogo.")).toBeVisible();
  });

  test("uva inexistente → 404", async ({ page }) => {
    const response = await page.goto("/uvas/uva-que-nao-existe");
    expect(response?.status()).toBe(404);
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/uvas/cabernet-sauvignon", html);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    for (const path of ["/uvas", "/uvas/malbec"]) {
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
