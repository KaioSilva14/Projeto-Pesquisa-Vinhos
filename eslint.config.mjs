// Configuração do ESLint (formato "flat config").
// No Next 16 o comando `next lint` não existe mais: usamos `eslint .` (script `npm run lint`).
// ESLint fixado na linha 9: os plugins do eslint-config-next ainda não suportam o 10 (ADR-022).
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
      // ignoreRestSiblings: permite remover um campo com `const { campo, ...resto } = objeto`
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
      // RULES.md §1.3: toda imagem tem `alt` (o Next deixa isso só como aviso)
      "jsx-a11y/alt-text": "error",
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
            {
              group: ["@/data", "@/data/*", "@/adapters", "@/adapters/*"],
              message: "Use os services (via props) em vez de importar dados diretamente.",
            },
            {
              group: ["@/services", "@/services/*"],
              message: "Services são server-only: receba os dados por props.",
            },
          ],
        },
      ],
    },
  },
  {
    // ARCHITECTURE.md §3: páginas pedem dados só aos services (nunca direto a data/adapters)
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/data", "@/data/*", "@/adapters", "@/adapters/*"],
              message: "Use catalogService de @/services em vez de ler os dados diretamente.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
]);
