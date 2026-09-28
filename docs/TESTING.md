# TESTING — Estratégia de testes

> Versão 0.1 · Fase 0 · 2026-09-28
> Objetivo: ter confiança para mudar o código sem medo, com o menor número de testes que cubra o que importa.

---

## 1. Pirâmide

| Camada | Ferramenta | Foco | Onde |
|---|---|---|---|
| **Validação de dados** | `scripts/validate-data.ts` (Zod + regras) | Veracidade e integridade (o teste mais importante deste projeto) | `npm run validate:data` |
| **Unitário** | Vitest | Funções puras: normalização, busca, filtros, facetas, relacionados, slug, SEO helpers, mapeamento sensorial, store de favoritos | `tests/unit/` |
| **Componente** | Vitest + Testing Library + jsdom | Comportamento visível: estados, acessibilidade básica, interação | `tests/component/` |
| **E2E** | Playwright (Chromium, Firefox, WebKit; viewports 360, 768, 1440) | Fluxos reais no build de produção | `tests/e2e/` |
| **Acessibilidade** | `@axe-core/playwright` | Violações WCAG nas rotas principais, temas claro e escuro | dentro dos E2E |
| **Performance** | Lighthouse CI | Orçamentos de `PERFORMANCE.md` | CI (fase 10) |

## 2. O que testar primeiro (ordem de prioridade)

1. **Validação de dados** (fase 2): fontes existem, imagens com licença, relações válidas, nenhum demo em produção, percentuais coerentes.
2. **Normalização e busca** (fase 3): "sauvinhon" encontra "Sauvignon"; "tinto frances" encontra resultados com "França"; entrada vazia; entrada gigante; caracteres especiais.
3. **Filtros e facetas** (fase 3): combinação E/OU; parâmetros inválidos ignorados; contagens corretas; opções vazias não aparecem.
4. **Componentes de honestidade** (fases 1 a 4): `ImageUnavailable` aparece sem imagem; `SensoryProfile` não mostra atributo sem fonte; `FactSheet` oculta campos ausentes; `DemoBadge` aparece com `isDemo`.
5. **Favoritos** (fase 6): adicionar/remover; persistência; `localStorage` indisponível; JSON corrompido; ids inexistentes ignorados.
6. **E2E dos fluxos do PRD** (J1 a J5).

## 3. Casos E2E mínimos

| ID | Fluxo |
|---|---|
| E2E-01 | Home → digitar com erro de digitação → sugestão correta → Enter → página do vinho |
| E2E-02 | `/` e `Ctrl+K` abrem a busca; `Esc` fecha; navegação por setas |
| E2E-03 | `/vinhos` → aplicar 3 filtros → URL contém filtros → recarregar mantém → voltar remove o último |
| E2E-04 | Mobile (360 px): abrir bottom sheet de filtros → aplicar → chips visíveis → limpar tudo |
| E2E-05 | Vinho → uva → região → produtor → vinho (navegação entre entidades) |
| E2E-06 | Favoritar vinho → `/favoritos` lista → recarregar mantém → remover |
| E2E-07 | Slug inexistente → 404 com busca |
| E2E-08 | axe sem violações sérias/críticas em: home, lista, vinho, uva, região, produtor, favoritos, pesquisa (claro e escuro) |
| E2E-09 | Com `reducedMotion: 'reduce'`, conteúdo completo visível sem esperar animações |
| E2E-10 | Página sem JavaScript: vinho e `/vinhos?tipo=tinto` renderizam conteúdo (SSR/SSG) |

## 4. Convenções

- Nomes em português descrevendo comportamento: `it("mostra 'Imagem indisponível' quando o vinho não tem foto")`.
- Consultas por papel/texto (`getByRole`, `getByLabelText`), nunca por classe CSS.
- Dados de teste: **fixtures fictícias** em `tests/fixtures/` (entidades "Exemplo"), nunca dados reais inventados.
- Um teste = um comportamento. Sem snapshots grandes.
- E2E rodam contra `npm run build && npm run start` (não contra o `dev`).

## 5. Como rodar (PowerShell, disponível após a Fase 1)

```powershell
npm run validate:data    # valida os dados
npm run test             # Vitest (unitário + componente), modo único
npm run test:watch       # Vitest observando mudanças
npm run test:coverage    # cobertura
npx playwright install   # (uma vez) baixa os navegadores do Playwright
npm run test:e2e         # Playwright (faz build + start automaticamente via webServer)
npm run test:e2e:ui      # Playwright com interface visual para depurar
```

## 6. Cobertura

- Meta: ≥ 80% de linhas em `src/lib/`, `src/services/`, `src/stores/`, `src/schemas/`.
- Componentes: cobertura por comportamento (casos acima), não por porcentagem.
- Cobertura não é objetivo em si; nunca escrever teste vazio para subir número.

## 7. CI

Ordem no GitHub Actions: `npm ci` → `lint` → `typecheck` → `validate:data` → `test` → `build` → `test:e2e` (fase 3+) → Lighthouse CI (fase 10). Qualquer falha bloqueia o merge.
