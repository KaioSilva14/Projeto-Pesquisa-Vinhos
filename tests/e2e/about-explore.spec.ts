import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F5-02 (Sobre) e F5-03 (Explorar)

const html = { waitUntil: "domcontentloaded" } as const;
const navigation = { timeout: 15_000 };

test.describe("Sobre", () => {
  test("lista os créditos de todas as imagens e o aviso de consumo responsável", async ({
    page,
  }) => {
    await page.goto("/sobre", html);
    await expect(page).toHaveTitle("Sobre o Vinum | Vinum");
    const credits = page.locator("#creditos");
    await expect(credits.getByRole("heading", { level: 3, name: "Uvas" })).toBeVisible();
    await expect(credits.getByRole("heading", { level: 3, name: "Vinhos" })).toBeVisible();
    await expect(credits.getByText(/Foto: Megan Mallen/)).toBeVisible();
    await expect(page.getByText(/proibidas para menores de 18 anos/).first()).toBeVisible();
  });

  test("o link do rodapé leva aos créditos", async ({ page }) => {
    await page.goto("/sobre#creditos", html);
    await expect(page.locator("#creditos")).toBeInViewport();
  });
});

test.describe("Explorar", () => {
  test("cada atalho leva à lista de vinhos já filtrada", async ({ page }) => {
    await page.goto("/explorar", html);
    await page.getByRole("link", { name: /^Itália/ }).click();
    await expect(page).toHaveURL(/\/vinhos\?pais=italia$/, navigation);
    await expect(page.getByRole("link", { name: "Remover filtro: Itália" })).toBeVisible();
  });

  test("o botão Explorar da barra inferior chega à página", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) >= 768, "barra inferior só no celular");
    await page.goto("/", html);
    await page
      .getByRole("navigation", { name: "Navegação inferior" })
      .getByRole("link", { name: "Explorar" })
      .click();
    await expect(page).toHaveURL(/\/explorar$/, navigation);
  });
});

for (const path of ["/sobre", "/explorar"]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${path} sem violações sérias de acessibilidade (${colorScheme === "light" ? "claro" : "escuro"})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path, html);
      await expectNoSeriousA11yViolations(page);
    });
  }
}
