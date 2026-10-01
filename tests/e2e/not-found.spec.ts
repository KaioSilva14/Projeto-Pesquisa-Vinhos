import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// E2E-07 (TESTING.md): endereço inexistente → 404 útil, com busca
test.describe("Página não encontrada", () => {
  test("responde 404 e oferece busca e caminho de volta", async ({ page }) => {
    const response = await page.goto("/pagina-que-nao-existe");

    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Página não encontrada | Vinum");
    await expect(
      page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
    ).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Pesquisar no Vinum" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ir para o início" })).toHaveAttribute("href", "/");
  });

  test("não é indexada por buscadores", async ({ page }) => {
    await page.goto("/pagina-que-nao-existe");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("não tem violações sérias de acessibilidade", async ({ page }) => {
    await page.goto("/pagina-que-nao-existe");
    await expectNoSeriousA11yViolations(page);
  });
});
