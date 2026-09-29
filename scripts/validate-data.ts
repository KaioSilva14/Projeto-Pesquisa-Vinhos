// Valida os catálogos de dados (DATA_MODEL.md §6). Uso: npm run validate:data
// Sai com código 1 se houver qualquer erro: no CI, isso bloqueia o merge.

import { existsSync } from "node:fs";
import path from "node:path";

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

/** Arquivo de cada imagem existe em public/ (fica fora da lib porque depende do disco). */
function checkImageFiles(data: Catalog): Issue[] {
  return data.images
    .filter((image) => !existsSync(path.join(process.cwd(), "public", image.src)))
    .map((image) => ({
      level: "error" as const,
      where: `images[${image.id}]`,
      message: `arquivo não encontrado: public${image.src}`,
    }));
}

console.log(`Catálogo real   → ${count(catalog)}`);
const realErrors = report("catálogo real", [
  ...validateCatalog(catalog, { isDemoSet: false }),
  ...checkImageFiles(catalog),
]);

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
