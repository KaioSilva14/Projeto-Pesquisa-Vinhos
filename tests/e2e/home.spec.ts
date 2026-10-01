import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F5-01: home editorial. Páginas com foto esperam só o HTML (servidor frio no CI).
const html = { waitUntil: "domcontentloaded" } as const;

test.describe("Home", () => {
  test("carrega com título, idioma, busca em destaque e os números do catálogo", async ({
    page,
  }) => {
    await page.goto("/", html);

    await expect(page).toHaveTitle(/Vinum/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Vinhos com fonte, do rótulo à região.",
    );
    await expect(page.getByRole("main").getByRole("search")).toBeVisible();
    const catalog = page.getByRole("navigation", { name: "O que há no catálogo" });
    await expect(catalog.getByRole("link", { name: /vinhos/ })).toHaveAttribute("href", "/vinhos");
  });

  test("tem as seções da narrativa, sem inventar conteúdo", async ({ page }) => {
    await page.goto("/", html);
    for (const title of [
      "Comece por uma uva",
      "Regiões",
      "Descubra um vinho",
      "Produtores",
      "Perguntas frequentes",
      "Continue explorando",
    ]) {
      await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
    }
  });

  test("JSON-LD do site com a ação de busca", async ({ page }) => {
    await page.goto("/", html);
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    expect(raw).toContain('"@type":"SearchAction"');
    expect(raw).toContain("/pesquisa?q={search_term_string}");
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/", html);

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
      await page.goto("/", html);

      await expectNoSeriousA11yViolations(page);
    });
  }
});
