// Configuração do ESLint (formato "flat config").
// Só funciona depois da Fase 1, quando `eslint` e `eslint-config-next` forem instalados.
// No Next 16 o comando `next lint` não existe mais: usamos `npx eslint .` (script `npm run lint`).
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals, // regras do Next + React + acessibilidade (jsx-a11y) + Core Web Vitals
  ...nextTs, // regras de TypeScript (typescript-eslint)
  {
    rules: {
      // RULES.md §2.1: `any` proibido sem justificativa
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // ARCHITECTURE.md §3: componentes nunca acessam dados ou serviços diretamente
    files: ["src/components/**/*.{ts,tsx}", "src/hooks/**/*.ts", "src/stores/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@/data/*", "@/adapters/*"], message: "Use os services (via props) em vez de importar dados diretamente." },
            { group: ["@/services/*"], message: "Services são server-only: receba os dados por props." },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);
