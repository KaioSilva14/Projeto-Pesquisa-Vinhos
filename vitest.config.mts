import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Mesmo atalho do tsconfig: "@/lib/cn" aponta para "src/lib/cn"
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Fora do Next, "server-only" lança erro de propósito; nos testes ele vira um módulo
      // vazio (o mesmo arquivo que o Next usa no servidor)
      "server-only": fileURLToPath(new URL("./node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  test: {
    // jsdom simula o navegador (document, window) para os testes de componente
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/component/**/*.test.tsx"],
  },
});
