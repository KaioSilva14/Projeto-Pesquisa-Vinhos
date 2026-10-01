import { expect, test } from "./helpers/test";

import { expectNoSeriousA11yViolations } from "./helpers/a11y";

// Itens básicos de um site profissional: CTA, perguntas frequentes, privacidade, correção com
// agradecimento, sitemap, robots, imagem para redes sociais e favicon.
const html = { waitUntil: "domcontentloaded" } as const;
// Com o servidor ocupado (rodada completa, CI), a 1ª visita a uma página pode passar de 5 s
const navigation = { timeout: 15_000 };

test.describe("Home: chamada e perguntas", () => {
  test("a primeira seção tem a chamada para explorar", async ({ page }) => {
    await page.goto("/", html);
    const hero = page.locator("section").filter({ has: page.getByRole("heading", { level: 1 }) });
    await expect(hero.getByRole("link", { name: "Explorar o catálogo" })).toHaveAttribute(
      "href",
      "/explorar",
    );
    await expect(hero.getByRole("link", { name: "Ver os vinhos" })).toHaveAttribute(
      "href",
      "/vinhos",
    );
  });

  test("5 perguntas frequentes que abrem pelo teclado", async ({ page }) => {
    await page.goto("/", html);
    const questions = page.locator("details summary");
    await expect(questions).toHaveCount(5);
    const first = questions.first();
    await first.scrollIntoViewIfNeeded();
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/não tem loja, preços, carrinho/)).toBeVisible();
  });
});

test.describe("Sugerir uma correção", () => {
  test("da página do vinho ao agradecimento", async ({ page, context }) => {
    // O GitHub não é aberto de verdade no teste: a nova aba recebe uma resposta falsa
    await context.route("https://github.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<title>GitHub</title>" }),
    );
    await page.goto("/vinhos/miolo-lote-43", html);
    await page.getByRole("link", { name: "Sugira uma correção" }).click();
    await expect(page).toHaveURL(
      /\/sugerir-correcao\?pagina=%2Fvinhos%2Fmiolo-lote-43/,
      navigation,
    );
    const pageField = page.getByLabel("Página com o erro");
    await expect(pageField).toHaveValue("/vinhos/miolo-lote-43", navigation);

    // Enviar sem descrever o erro: mensagem útil no lugar certo
    await page.getByRole("button", { name: "Continuar no GitHub" }).click();
    const summary = page.getByRole("alert").filter({ hasText: "Falta corrigir" });
    await expect(summary).toContainText("O que está errado?");
    // O resumo recebe o foco no quadro seguinte da tela: só depois disso dá para digitar
    // (senão o foco pula no meio da digitação e o texto se perde, visto no WebKit)
    await expect(summary).toBeFocused();

    await page
      .getByLabel("O que está errado?")
      .fill("O texto diz uma safra, mas a ficha técnica diz outra.");
    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Continuar no GitHub" }).click();
    const popup = await popupPromise;
    expect(popup.url()).toContain("/issues/new");
    expect(new URL(popup.url()).searchParams.get("title")).toBe(
      "Correção de dados: /vinhos/miolo-lote-43",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Obrigado pela sugestão",
      navigation,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("formulário sem violações sérias de acessibilidade", async ({ page }) => {
    await page.goto("/sugerir-correcao", html);
    await page.getByRole("button", { name: "Continuar no GitHub" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Faltam corrigir" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});

test.describe("Privacidade", () => {
  test("diz o que fica guardado e está no rodapé", async ({ page }) => {
    await page.goto("/privacidade", html);
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Privacidade" }),
    ).toHaveAttribute("href", "/privacidade");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Política de privacidade");
    await expect(page.getByText("vinum-favoritos")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
});

test.describe("SEO técnico", () => {
  test("robots.txt bloqueia o que não deve ser indexado e aponta o sitemap", async ({
    request,
  }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /pesquisa");
    expect(robots).toContain("Disallow: /favoritos");
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });

  test("sitemap.xml lista as páginas públicas e deixa de fora as pessoais", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/vinhos/miolo-lote-43</loc>");
    expect(sitemap).toContain("/privacidade</loc>");
    expect(sitemap).not.toContain("/favoritos</loc>");
    expect(sitemap).not.toContain("/obrigado</loc>");
  });

  test("favicon e imagem para redes sociais existem e são PNG", async ({ page, request }) => {
    await page.goto("/vinhos/miolo-lote-43", html);
    // Há vários ícones (favicon.ico + tamanhos em PNG): confere o primeiro PNG
    const icon = await page
      .locator('link[rel="icon"][type="image/png"]')
      .first()
      .getAttribute("href");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(icon).toBeTruthy();
    expect(og).toContain("/vinhos/miolo-lote-43/opengraph-image");
    for (const url of [icon!, new URL(og!).pathname]) {
      const response = await request.get(url);
      expect(response.headers()["content-type"]).toBe("image/png");
    }
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("ícones completos: favicon.ico, tamanhos, iPhone, maskable e manifesto", async ({
    request,
  }) => {
    const favicon = await request.get("/favicon.ico");
    expect(favicon.ok()).toBe(true);
    for (const path of ["/icon/32", "/icon/192", "/icon/512", "/apple-icon", "/icone-maskable"]) {
      const response = await request.get(path);
      expect(response.headers()["content-type"], path).toBe("image/png");
    }
    const manifest = (await (await request.get("/manifest.webmanifest")).json()) as {
      short_name: string;
      lang: string;
      icons: { src: string; purpose: string }[];
    };
    expect(manifest.short_name).toBe("Vinum");
    expect(manifest.lang).toBe("pt-BR");
    expect(manifest.icons.map((icon) => icon.purpose)).toContain("maskable");
    for (const icon of manifest.icons)
      expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
  });

  test("títulos e descrições de todas as páginas do sitemap dentro do limite", async ({
    request,
  }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]!).pathname,
    );
    const decode = (text: string) =>
      text.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
    for (const path of paths) {
      const page = await (await request.get(path)).text();
      const title = decode(/<title>([^<]*)<\/title>/.exec(page)?.[1] ?? "");
      const description = decode(
        /<meta name="description" content="([^"]*)"/.exec(page)?.[1] ?? "",
      );
      expect(title.length, `título de ${path}: ${title}`).toBeLessThanOrEqual(60);
      expect(description.length, `descrição de ${path}`).toBeLessThanOrEqual(155);
      expect(description.length, `descrição de ${path}`).toBeGreaterThanOrEqual(50);
    }
  });
});
