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
    const violations: string[] = [];
    page.on("console", (message) => {
      if (/Content[- ]Security[- ]Policy/i.test(message.text())) violations.push(message.text());
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(violations).toEqual([]);
  });
});
