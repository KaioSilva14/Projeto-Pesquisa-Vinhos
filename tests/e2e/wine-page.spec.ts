import { expect, test } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// F4-01: página do vinho, gerada no build a partir dos dados reais

test.describe("Página do vinho", () => {
  test("chega pelo card da lista e mostra ficha, safra e fontes", async ({ page }) => {
    await page.goto("/vinhos?tipo=tinto&pais=franca");
    await page.getByRole("link", { name: "Château Palmer", exact: true }).first().click();

    await expect(page).toHaveURL(/\/vinhos\/chateau-palmer$/);
    await expect(page).toHaveTitle("Château Palmer (Château Palmer) | Vinum");
    await expect(page.getByRole("heading", { level: 1, name: "Château Palmer" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Ficha técnica" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Safra 2022" })).toBeVisible();
    await expect(page.getByText("Imagem indisponível")).toBeVisible();
  });

  test("a nota de fonte leva à fonte certa na lista", async ({ page }) => {
    await page.goto("/vinhos/catena-malbec");
    await page.getByRole("link", { name: "Fonte 1" }).first().click();
    await expect(page).toHaveURL(/#fonte-1$/);
    const source = page.locator("#fonte-1");
    await expect(source).toBeInViewport();
    await expect(source.getByRole("link")).toHaveAttribute("href", /^https:\/\//);
  });

  test("campos que a ficha não informa não aparecem", async ({ page }) => {
    // A ficha do Palmer 2022 não informa teor alcoólico nem perfil sensorial
    await page.goto("/vinhos/chateau-palmer");
    await expect(page.getByText("Teor alcoólico")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Perfil sensorial" })).toHaveCount(0);
  });

  test("JSON-LD de produto sem preço, oferta ou avaliação", async ({ page }) => {
    await page.goto("/vinhos/roederer-brut-nature");
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? "{}") as { "@graph": { "@type": string }[] };
    expect(data["@graph"].map((item) => item["@type"])).toEqual(["WebPage", "BreadcrumbList"]);
    expect(raw).not.toMatch(/offers|price|aggregateRating|review/i);
  });

  test("canonical e indexável", async ({ page }) => {
    await page.goto("/vinhos/lagar-de-cervera");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/vinhos\/lagar-de-cervera$/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });

  // E2E-07 (TESTING.md)
  test("vinho inexistente → 404", async ({ page }) => {
    const response = await page.goto("/vinhos/vinho-que-nao-existe");
    expect(response?.status()).toBe(404);
  });

  test("não tem rolagem horizontal", async ({ page }) => {
    await page.goto("/vinhos/catena-zapata-malbec-argentino");
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
      await page.goto("/vinhos/roederer-collection-245");
      await expectNoSeriousA11yViolations(page);
    });
  }
});
