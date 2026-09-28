// Roda antes de cada commit (via Husky), só nos arquivos que estão no commit.
// Se algum comando falhar, o commit é cancelado e nada é perdido.
// Checagens mais lentas (typecheck, build, E2E) ficam no CI.
const config = {
  "*.{ts,tsx,mts,mjs}": [
    "eslint --fix",
    "prettier --write",
    // Roda apenas os testes ligados aos arquivos alterados
    "vitest related --run --passWithNoTests",
  ],
  "*.{css,json,yml,yaml}": "prettier --write",
};

export default config;
