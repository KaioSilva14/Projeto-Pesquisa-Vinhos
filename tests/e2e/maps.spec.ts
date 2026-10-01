import type { Page } from "@playwright/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";
import { expect, test } from "./helpers/test";

// Fase 9 (ADR-033): mapas reais (Leaflet + OpenStreetMap), carregados só a pedido e sempre com
// alternativa em texto. As imagens do mapa são trocadas por um PNG em branco (helpers/test.ts).
const html = { waitUntil: "domcontentloaded" } as const;
const mapLocator = (page: Page) => page.locator('[aria-roledescription="mapa"]');

/** Pede o mapa (o botão pode ser clicado antes de a página ativar o JavaScript). */
async function showMap(page: Page, sectionTitle: string) {
  await page.getByRole("heading", { level: 2, name: sectionTitle }).scrollIntoViewIfNeeded();
  await expect(async () => {
    await page.getByRole("button", { name: "Mostrar o mapa" }).click({ timeout: 2000 });
    await expect(mapLocator(page)).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15_000 });
}

test.describe("Mapas", () => {
  test("região: mapa com marcador, explicação em texto e link para o OpenStreetMap", async ({
    page,
  }) => {
    await page.goto("/regioes/barolo", html);
    // A explicação e o link existem antes do mapa (e sem JavaScript)
    await expect(
      page.getByText(/O marcador indica Barolo, lugar retratado na foto acima/),
    ).toBeVisible();
    await expect(page.getByText(/os limites da denominação não estão desenhados/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Ver no OpenStreetMap" })).toHaveAttribute(
      "href",
      /openstreetmap\.org\/\?mlat=44\.6147&mlon=7\.9394/,
    );

    await showMap(page, "Onde fica");
    const map = mapLocator(page);
    await expect(map).toHaveAttribute("aria-label", /Mapa de Barolo, com um marcador em Barolo/);
    await expect(map).toBeFocused();
    await expect(map.locator(".leaflet-interactive")).toHaveCount(1);
    // Atribuição exigida pela licença do OpenStreetMap, dentro do próprio mapa
    await expect(map.getByRole("link", { name: "colaboradores do OpenStreetMap" })).toBeVisible();
  });

  test("país: um marcador por região", async ({ page }) => {
    await page.goto("/paises/argentina", html);
    await showMap(page, "Regiões");
    const map = mapLocator(page);
    await expect(map.locator(".leaflet-interactive")).toHaveCount(2);
    await expect(map).toHaveAttribute("aria-label", /Mendoza, Valle de Cafayate/);
  });

  test("nada é baixado do OpenStreetMap antes de a pessoa pedir o mapa", async ({ page }) => {
    const tiles: string[] = [];
    page.on("request", (request) => {
      if (request.url().startsWith("https://tile.openstreetmap.org/")) tiles.push(request.url());
    });
    await page.goto("/paises/argentina", html);
    await page.getByRole("heading", { level: 2, name: "Regiões" }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(tiles).toEqual([]);
    await showMap(page, "Regiões");
    await expect.poll(() => tiles.length).toBeGreaterThan(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`sem violações sérias de acessibilidade, antes e depois do mapa (${colorScheme === "light" ? "claro" : "escuro"})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto("/regioes/mendoza", html);
      await expectNoSeriousA11yViolations(page);
      await showMap(page, "Onde fica");
      await expect(mapLocator(page).locator(".leaflet-interactive")).toHaveCount(1);
      await expectNoSeriousA11yViolations(page);
    });
  }
});
