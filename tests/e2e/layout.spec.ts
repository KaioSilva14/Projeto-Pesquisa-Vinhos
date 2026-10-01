import { expect, test } from "./helpers/test";

test.describe("Layout", () => {
  test("o primeiro Tab mostra o 'Pular para o conteúdo', que leva ao conteúdo principal", async ({
    page,
    browserName,
  }) => {
    // No Safari (WebKit), Tab só percorre links com uma opção do sistema ativada
    test.skip(browserName === "webkit", "Tab não foca links no WebKit por padrão");
    await page.goto("/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("tem cabeçalho, conteúdo e rodapé com o aviso 18+", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toContainText("proibidas para menores de 18 anos");
  });

  test("celular usa a barra inferior; tablet e desktop, o menu do cabeçalho", async ({ page }) => {
    await page.goto("/");
    const isMobile = (page.viewportSize()?.width ?? 0) < 768;
    const bottomNav = page.getByRole("navigation", { name: "Navegação inferior" });
    const mainNav = page.getByRole("navigation", { name: "Principal" });

    if (isMobile) {
      await expect(bottomNav).toBeVisible();
      await expect(mainNav).toBeHidden();
      await expect(bottomNav.getByRole("link", { name: "Início" })).toHaveAttribute(
        "aria-current",
        "page",
      );
    } else {
      await expect(bottomNav).toBeHidden();
      await expect(mainNav).toBeVisible();
    }
  });

  test("a barra inferior não cobre o fim do rodapé no celular", async ({ page }) => {
    await page.goto("/");
    test.skip((page.viewportSize()?.width ?? 0) >= 768, "Só existe no celular");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footerText = page.getByText(/Informações com fonte registrada/);
    const navBox = await page.getByRole("navigation", { name: "Navegação inferior" }).boundingBox();
    const textBox = await footerText.boundingBox();

    expect(navBox).not.toBeNull();
    expect(textBox).not.toBeNull();
    if (navBox && textBox) expect(textBox.y + textBox.height).toBeLessThanOrEqual(navBox.y);
  });
});
