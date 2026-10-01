import type { Page } from "@playwright/test";

import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F3-03: autocomplete do cabeçalho (desktop) e da página de pesquisa (todas as larguras)

const headerSearch = (page: Page) =>
  page.getByRole("banner").getByRole("combobox", { name: /Pesquisar vinhos/ });

test.describe("Autocomplete no cabeçalho", () => {
  test.beforeEach(({ page }, testInfo) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < 1024,
      `campo do cabeçalho só aparece a partir de 1024 px (${testInfo.project.name})`,
    );
  });

  // E2E-01 (TESTING.md)
  test("erro de digitação → sugestão certa → Enter abre a página", async ({ page }) => {
    await page.goto("/");
    await headerSearch(page).fill("malbek");

    const listbox = page.getByRole("listbox", { name: "Sugestões" });
    await expect(listbox.getByRole("group", { name: "Uvas" })).toContainText("Malbec");
    await headerSearch(page).press("ArrowDown");
    await expect(listbox.getByRole("option", { selected: true })).toContainText("Malbec");
    await headerSearch(page).press("Enter");
    await expect(page).toHaveURL(/\/uvas\/malbec$/);
  });

  // E2E-02 (TESTING.md)
  test("/ e Ctrl+K focam a busca; Esc fecha; setas navegam", async ({ page }) => {
    // Página sem busca própria nem fotos: o atalho vai para o campo do cabeçalho
    await page.goto("/harmonizacoes");
    await page.keyboard.press("/");
    await expect(headerSearch(page)).toBeFocused();

    await page.keyboard.type("barolo");
    const listbox = page.getByRole("listbox", { name: "Sugestões" });
    await expect(listbox).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(listbox.getByRole("option", { selected: true })).toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(listbox).toBeHidden();
    await expect(headerSearch(page)).toHaveValue("barolo");

    await page.getByRole("link", { name: "Vinum", exact: true }).first().focus();
    await page.keyboard.press("Control+k");
    await expect(headerSearch(page)).toBeFocused();
  });

  test("na home, / foca a busca em destaque, não a do cabeçalho", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("/");
    await expect(page.getByRole("main").getByRole("combobox")).toBeFocused();
  });

  test("Enter sem escolher opção leva à página de resultados", async ({ page }) => {
    await page.goto("/");
    await headerSearch(page).fill("tinto frances");
    await headerSearch(page).press("Enter");
    await expect(page).toHaveURL(/\/pesquisa\?q=tinto\+frances$/);
  });

  test("sugestões abertas não têm violações sérias de acessibilidade", async ({ page }) => {
    await page.goto("/");
    await headerSearch(page).fill("malbec");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});

test.describe("Autocomplete na página de pesquisa", () => {
  test("chegar sem busca já deixa o campo focado", async ({ page }) => {
    await page.goto("/pesquisa");
    await expect(page.getByRole("main").getByRole("combobox")).toBeFocused();
  });

  test("clique numa sugestão abre a página", async ({ page }) => {
    await page.goto("/pesquisa");
    await page.getByRole("main").getByRole("combobox").fill("champanhe");
    await page
      .getByRole("option", { name: /Champagne/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/regioes\/champagne$/);
  });
});
