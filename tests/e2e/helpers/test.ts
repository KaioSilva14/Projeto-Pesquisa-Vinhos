import { test as base } from "@playwright/test";

// Os testes nunca baixam o mapa do OpenStreetMap de verdade: a política de uso dos servidores
// pede para evitar tráfego automático (ADR-033). Cada imagem do mapa vira um PNG em branco.
const BLANK_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

export const test = base.extend<{ blockMapTiles: void }>({
  blockMapTiles: [
    async ({ context }, use) => {
      await context.route("https://tile.openstreetmap.org/**", (route) =>
        route.fulfill({ contentType: "image/png", body: BLANK_PNG }),
      );
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
