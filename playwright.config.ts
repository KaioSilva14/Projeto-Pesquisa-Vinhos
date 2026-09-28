import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

// Larguras de referência do DESIGN.md: 360 (celular), 768 (tablet), 1440 (desktop)
const mobile = { width: 360, height: 780 };
const tablet = { width: 768, height: 1024 };
const desktop = { width: 1440, height: 900 };

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Localmente, no máximo 4 navegadores ao mesmo tempo: com mais, o Firefox falhava por falta
  // de memória (erros gráficos internos). No CI fica o padrão do Playwright.
  ...(process.env.CI ? {} : { workers: 4 }),
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    locale: "pt-BR",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium-360", use: { ...devices["Desktop Chrome"], viewport: mobile } },
    { name: "chromium-768", use: { ...devices["Desktop Chrome"], viewport: tablet } },
    { name: "chromium-1440", use: { ...devices["Desktop Chrome"], viewport: desktop } },
    { name: "firefox-1440", use: { ...devices["Desktop Firefox"], viewport: desktop } },
    { name: "webkit-360", use: { ...devices["iPhone 13"], viewport: mobile } },
  ],
  // Os testes rodam contra o build de produção, não contra o `next dev` (TESTING.md §4)
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  },
});
