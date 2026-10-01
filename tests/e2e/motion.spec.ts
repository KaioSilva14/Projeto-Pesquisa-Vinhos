import { expect, test } from "@playwright/test";

// F7-02: animações em CSS, sempre com conteúdo completo (ANIMATIONS.md)

const reveals = "[data-reveal]";

test.describe("Animações", () => {
  // E2E-09 (TESTING.md)
  test("com movimento reduzido, todo o conteúdo aparece sem esperar animação", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    for (const element of await page.locator(reveals).all()) {
      await expect(element).toHaveAttribute("data-reveal", "visible");
      await expect(element).toHaveCSS("opacity", "1");
    }
    await expect(
      page.getByRole("heading", { level: 2, name: "Continue explorando" }),
    ).toBeVisible();
  });

  test("sem movimento reduzido, a seção abaixo da tela entra ao rolar", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const last = page.locator(reveals).last();
    await expect(last).toHaveAttribute("data-reveal", "waiting");
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveAttribute("data-reveal", "entering");
    await expect(
      page.getByRole("heading", { level: 2, name: "Continue explorando" }),
    ).toBeVisible();
  });

  test("sem JavaScript, nada fica escondido", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    for (const element of await page.locator(reveals).all()) {
      await expect(element).toHaveCSS("opacity", "1");
    }
    await context.close();
  });

  test("o cabeçalho ganha sombra depois de rolar", async ({ page }) => {
    await page.goto("/harmonizacoes", { waitUntil: "domcontentloaded" });
    const html = page.locator("html");
    await expect(html).not.toHaveAttribute("data-scrolled");
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(html).toHaveAttribute("data-scrolled");
  });
});
