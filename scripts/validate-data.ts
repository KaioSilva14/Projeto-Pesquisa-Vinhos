// Valida os catálogos de dados (DATA_MODEL.md §6). Uso: npm run validate:data
// Sai com código 1 se houver qualquer erro: no CI, isso bloqueia o merge.

import { catalog } from "@/data/catalog";
import { demoCatalog } from "@/data/demo/catalog";
import { validateCatalog, type Issue } from "@/lib/validation/validate-catalog";
import type { Catalog } from "@/schemas/catalog";

function count(data: Catalog) {
  return Object.entries(data)
    .map(([name, items]) => `${name}: ${(items as unknown[]).length}`)
    .join(" · ");
}

function report(label: string, issues: Issue[]) {
  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warning");
  for (const issue of issues) {
    const tag = issue.level === "error" ? "ERRO " : "AVISO";
    console.log(`  ${tag} ${issue.where}: ${issue.message}`);
  }
  console.log(`  ${label}: ${errors.length} erro(s), ${warnings.length} aviso(s)\n`);
  return errors.length;
}

console.log(`Catálogo real   → ${count(catalog)}`);
const realErrors = report("catálogo real", validateCatalog(catalog, { isDemoSet: false }));

console.log(`Catálogo demo   → ${count(demoCatalog)}`);
const demoErrors = report(
  "catálogo de demonstração",
  validateCatalog(demoCatalog, { isDemoSet: true }),
);

if (realErrors + demoErrors > 0) {
  console.error("Dados inválidos. Corrija os erros acima antes de continuar.");
  process.exit(1);
}
console.log("Dados válidos.");
