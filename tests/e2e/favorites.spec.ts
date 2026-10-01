import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F6-02: favoritos no navegador, sem conta

const html = { waitUntil: "domcontentloaded" } as const;

test.describe("Favoritos", () => {
  // E2E-06 (TESTING.md)
  test("favoritar → aparece na lista → recarregar mantém → remover", async ({ page }) => {
    await page.goto("/vinhos/miolo-lote-43", html);
    const save = page.getByRole("button", { name: "Salvar Miolo Lote 43 nos favoritos" });
    // Só fica ativo depois de ler os favoritos do navegador
    await expect(save).toBeEnabled();
    await save.click();
    await expect(
      page.getByRole("button", { name: "Remover Miolo Lote 43 dos favoritos" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.goto("/favoritos", html);
    const list = page.getByRole("list", { name: "Vinhos favoritos" });
    await expect(list.getByRole("link", { name: "Miolo Lote 43" })).toBeVisible();

    await page.reload(html);
    await expect(list.getByRole("link", { name: "Miolo Lote 43" })).toBeVisible();

    await list.getByRole("button", { name: "Remover Miolo Lote 43 dos favoritos" }).click();
    await expect(page.getByRole("heading", { name: "Nenhum favorito ainda" })).toBeVisible();
  });

  test("favorito de outro tipo (uva) aparece no grupo certo", async ({ page }) => {
    await page.goto("/uvas/nebbiolo", html);
    const save = page.getByRole("button", { name: "Salvar Nebbiolo nos favoritos" });
    await expect(save).toBeEnabled();
    await save.click();
    await page.goto("/favoritos", html);
    await expect(
      page.getByRole("list", { name: "Uvas favoritas" }).getByRole("link", { name: "Nebbiolo" }),
    ).toBeVisible();
  });

  test("dado corrompido no navegador não quebra a página", async ({ page }) => {
    await page.goto("/favoritos", html);
    await page.evaluate(() => window.localStorage.setItem("vinum-favoritos", "{corrompido"));
    await page.reload(html);
    await expect(page.getByRole("heading", { name: "Nenhum favorito ainda" })).toBeVisible();
  });

  test("fica fora dos buscadores", async ({ page }) => {
    await page.goto("/favoritos", html);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`sem violações sérias de acessibilidade (${colorScheme === "light" ? "claro" : "escuro"})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/favoritos", html);
      await expect(page.getByRole("heading", { name: "Nenhum favorito ainda" })).toBeVisible();
      await expectNoSeriousA11yViolations(page);
    });
  }
});
