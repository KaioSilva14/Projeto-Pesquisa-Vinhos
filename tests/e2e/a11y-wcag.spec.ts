import type { Page } from "@playwright/test";

import { expect, test } from "./helpers/test";

// F10-02: critérios WCAG 2.2 AA que o axe não verifica sozinho (ACCESSIBILITY.md §2).
// Rodam uma vez (Chromium, desktop): cada teste define a própria largura de tela.
const html = { waitUntil: "domcontentloaded" } as const;
const PAGES = [
  "/",
  "/vinhos",
  "/vinhos/la-rioja-alta-gran-reserva-904",
  "/uvas/torrontes-riojano",
  "/regioes/valle-de-cafayate",
  "/paises/estados-unidos",
  "/produtores/chateau-montelena",
  "/harmonizacoes",
  "/pesquisa?q=tinto",
  "/sugerir-correcao",
  "/privacidade",
];

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test.describe("WCAG 2.2 além do axe", () => {
  test.beforeEach(({ browserName }, testInfo) => {
    test.skip(
      browserName !== "chromium" || !testInfo.project.name.endsWith("1440"),
      "roda uma vez só",
    );
  });

  // 1.4.10: 320 px de largura equivale a 400% de zoom numa tela de 1280 px
  test("1.4.10 reflow: nenhuma página rola para o lado em 320 px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const path of PAGES) {
      await page.goto(path, html);
      expect(await horizontalOverflow(page), path).toBeLessThanOrEqual(0);
    }
  });

  // 1.4.12: o texto aguenta o espaçamento aumentado sem transbordar
  test("1.4.12 espaçamento de texto aumentado não quebra o layout", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    for (const path of ["/", "/vinhos/la-rioja-alta-gran-reserva-904", "/sugerir-correcao"]) {
      await page.goto(path, html);
      await page.addStyleTag({
        content:
          "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }",
      });
      expect(await horizontalOverflow(page), path).toBeLessThanOrEqual(0);
    }
  });

  // 2.4.7 e 2.4.11: todo elemento alcançado pelo Tab mostra o foco e não fica atrás do cabeçalho
  for (const path of ["/", "/vinhos/miolo-lote-43", "/regioes/rioja"]) {
    test(`2.4.7 e 2.4.11 em ${path}: foco sempre visível e nunca escondido`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(path, html);
      await page.waitForLoadState("load");
      const problems: string[] = [];
      for (let step = 0; step < 45; step++) {
        await page.keyboard.press("Tab");
        const state = await page.evaluate(() => {
          const element = document.activeElement as HTMLElement | null;
          if (!element || element === document.body) return null;
          // Indicador no próprio elemento ou no cartão que o contém (o link cobre o cartão
          // inteiro e o anel de foco é desenhado no cartão)
          const shows = (node: Element) => {
            const style = getComputedStyle(node);
            const outline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
            return outline || style.boxShadow !== "none";
          };
          const card = element.closest("article");
          const visible = shows(element) || (card !== null && shows(card));
          // Escondido = outra coisa (ex.: o cabeçalho fixo) está por cima do centro do elemento
          const rect = element.getBoundingClientRect();
          const top = document.elementFromPoint(
            rect.left + Math.min(rect.width / 2, 20),
            rect.top + rect.height / 2,
          );
          const hidden =
            top !== null && !(top === element || element.contains(top) || top.contains(element));
          const name = (
            element.getAttribute("aria-label") ??
            element.textContent ??
            element.tagName
          )
            .trim()
            .slice(0, 40);
          return { name, visible, hidden };
        });
        if (!state) continue;
        if (!state.visible) problems.push(`sem indicador de foco: ${state.name}`);
        if (state.hidden) problems.push(`atrás do cabeçalho: ${state.name}`);
      }
      expect(problems).toEqual([]);
    });
  }
});
