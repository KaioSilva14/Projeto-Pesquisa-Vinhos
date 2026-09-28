import { expect, test } from "@playwright/test";

test.describe("Headers de segurança", () => {
  test("são enviados pelo servidor de produção", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("a CSP não bloqueia nada na página", async ({ page }) => {
    // O navegador dispara "securitypolicyviolation" a cada bloqueio da CSP; guardamos todos,
    // desde antes do primeiro script da página rodar
    await page.addInitScript(() => {
      const store: string[] = [];
      Object.assign(window, { __cspViolations: store });
      document.addEventListener("securitypolicyviolation", (event) => {
        store.push(`${event.violatedDirective}: ${event.blockedURI}`);
      });
    });

    await page.goto("/");
    await page.waitForLoadState("load");
    // Margem para scripts carregados depois do "load" (hidratação, prefetch)
    await page.waitForTimeout(1000);

    const violations = await page.evaluate(
      () => (window as unknown as { __cspViolations: string[] }).__cspViolations,
    );
    expect(violations).toEqual([]);
  });
});
