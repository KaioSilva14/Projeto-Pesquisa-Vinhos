# TASKS — Backlog por fases

> Atualizado em 2026-09-28 (Fase 0 aprovada). Status: `todo` · `doing` · `done` · `blocked`. Prioridade: **P0** (bloqueia o MVP) · **P1** (MVP) · **P2** (v1) · **P3** (futuro).
> Regra: uma tarefa por vez. Ao concluir, marcar `done` e atualizar `MEMORY.md`.

---

## Fase 0 — Descoberta e documentação

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F0-01 | Analisar referências de design | Pastas procuradas; ausência registrada; pergunta ao usuário feita | P0 | — | done |
| F0-02 | Analisar skills e MCPs disponíveis | Lista em `ARCHITECTURE.md` §15 | P0 | — | done |
| F0-03 | Conferir versões atuais das dependências | Versões e compatibilidade (peer deps) registradas | P0 | — | done |
| F0-04 | PRD | `docs/PRD.md` completo | P0 | — | done |
| F0-05 | Arquitetura + riscos | `docs/ARCHITECTURE.md` completo | P0 | F0-03 | done |
| F0-06 | Design System | `docs/DESIGN.md` com tokens e contraste medido | P0 | F0-01 | done |
| F0-07 | Regras | `docs/RULES.md` | P0 | — | done |
| F0-08 | Modelo de dados e fontes | `docs/DATA_MODEL.md`, `docs/DATA_SOURCES.md` | P0 | — | done |
| F0-09 | Imagens, SEO, segurança, a11y, performance, animações, testes | Docs correspondentes em `docs/` | P0 | — | done |
| F0-10 | Decisões, tarefas, memória, changelog, README | `docs/DECISIONS.md`, `docs/TASKS.md`, `docs/MEMORY.md`, `docs/CHANGELOG.md`, `README.md` | P0 | — | done |
| F0-11 | Arquivos de configuração do repositório | `.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `.env.example`, `.node-version` | P0 | — | done |
| F0-12 | **Aprovação do usuário** | Usuário aprova os docs e responde às questões em aberto (`PRD.md` §13) | P0 | F0-01…F0-11 | done (aprovado em 2026-09-28) |

## Fase 1 — Fundação

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F1-01 | Mover o projeto para fora do OneDrive (ADR-016) | Pasta em `C:\dev\Projeto-Vinhos` aberta no VS Code; cópia antiga removida com confirmação | P0 | F0-12 | doing (conteúdo antigo apagado; falta só remover a pasta vazia no OneDrive após fechar a janela antiga do VS Code) |
| F1-02 | `git init` + primeiro commit dos docs + repositório no GitHub | `main` com os docs; `.gitignore` funcionando | P0 | F1-01 | done (github.com/KaioSilva14/Projeto-Pesquisa-Vinhos) |
| F1-03 | Scaffold manual: `package.json`, Next 16, React 19, TS 6 (`strict`), `tsconfig` com alias `@/` | `npm run dev` abre página inicial vazia | P0 | F1-02 | done |
| F1-04 | Tailwind v4 + tokens do `DESIGN.md` em `globals.css` (claro/escuro) | Tokens usados numa página de teste; contraste confirmado com axe | P0 | F1-03 | todo |
| F1-05 | Fontes Newsreader + Hanken Grotesk via `next/font` | Sem CLS; acentos e números tabulares ok | P0 | F1-04 | todo |
| F1-06 | ESLint + Prettier (+ plugin Tailwind) + scripts `lint`, `format`, `typecheck` | Comandos passam sem erros | P0 | F1-03 | todo |
| F1-07 | Vitest + Testing Library + primeiro teste (`cn`, `normalize`) | `npm run test` verde | P0 | F1-03 | todo |
| F1-08 | Playwright + axe + primeiro E2E (home carrega, sem violações) | `npm run test:e2e` verde | P1 | F1-03 | todo |
| F1-09 | Husky + lint-staged | Commit roda lint/format nos arquivos alterados | P1 | F1-06 | todo |
| F1-10 | GitHub Actions CI (lint, typecheck, test, build) | CI verde em PR | P0 | F1-06, F1-07 | todo |
| F1-11 | Headers de segurança + CSP (`SECURITY.md` §3) e `src/config/env.ts` com Zod | Headers presentes em `npm run start` | P1 | F1-03 | todo |
| F1-12 | Componentes `ui/`: Button, IconButton, Input, SearchInput, Badge, Chip, Card base, Skeleton | Variantes CVA, todos os estados, testes de componente | P0 | F1-04 | todo |
| F1-13 | Componentes `ui/` sobre Radix: Dialog, Sheet, Popover, Tooltip, Select, Checkbox, Accordion, Tabs | Teclado/foco ok; testes | P1 | F1-12 | todo |
| F1-14 | Layout: SiteHeader, SiteFooter (aviso 18+), BottomNav, SkipLink, Breadcrumbs, PageHeader, Section | Responsivo em 360/768/1440; axe ok | P0 | F1-12 | todo |
| F1-15 | Estados: EmptyState, ErrorState, NoResults, IncompleteDataNote, DemoBadge; `not-found.tsx`, `error.tsx` | Renderizam em página de teste | P0 | F1-12 | todo |
| F1-16 | Mídia: EntityImage, ImageUnavailable, ImageCredit | Sem imagem → estado honesto sem CLS | P0 | F1-12 | todo |

## Fase 2 — Dados e serviços

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F2-01 | Schemas Zod de todas as entidades + tipos derivados | Conforme `DATA_MODEL.md`; testes de schema | P0 | F1-03 | todo |
| F2-02 | `scripts/validate-data.ts` com as 13 regras de integridade | Falha com dados inválidos de teste; `npm run validate:data` no CI | P0 | F2-01 | todo |
| F2-03 | Adapter local + services (get por slug, listas, relações) com `server-only` | Testes unitários | P0 | F2-01 | todo |
| F2-04 | Dados demo em `src/data/demo/` (fictícios, `isDemo`) + flag de ambiente | Selo visível; bloqueados em produção | P1 | F2-03 | todo |
| F2-05 | Propor regiões, uvas e produtores de cada lote dentro dos 6 países (ADR-019) | Lista aprovada pelo usuário, com fonte primária identificada para cada item | P0 | F0-12 | todo |
| F2-06 | Curadoria lote 1a: uvas (8–12) com fontes e imagens licenciadas | `validate:data` verde; 100% com fonte | P0 | F2-02, F2-05 | todo |
| F2-07 | Curadoria lote 1b: 6 países (Itália, França, Espanha, EUA, Argentina, Brasil) e 6–12 regiões | Idem | P0 | F2-06 | todo |
| F2-08 | Curadoria lotes 2 e 3: produtores (6–12) e vinhos (12–30) com safras | Idem | P0 | F2-07 | todo |
| F2-09 | Tabela de mapeamento sensorial (`lib/sensory-map.ts`) revisada | Termos das fontes reais cobertos | P1 | F2-08 | todo |

## Fase 3 — Busca e catálogo

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F3-01 | `lib/normalize.ts` + testes (acentos, erros) | Casos do `TESTING.md` §2 | P0 | F1-07 | todo |
| F3-02 | Índice de busca estático `/api/search-index` | ≤ 150 KB; gerado no build | P0 | F2-03 | todo |
| F3-03 | `SearchCombobox` (autocomplete agrupado, lazy, atalhos `/` e `Ctrl+K`) | Padrão APG; E2E-01/02 | P0 | F3-02, F1-13 | todo |
| F3-04 | Página `/pesquisa?q=` (servidor) com NoResults | E2E-01 | P0 | F3-01 | todo |
| F3-05 | Filtros: schema, facetas, `/vinhos` dinâmico, nuqs | E2E-03; opções vazias não aparecem | P0 | F2-03 | todo |
| F3-06 | FilterPanel (desktop) + bottom sheet (mobile) + ActiveFilters + ordenação + "Carregar mais" | E2E-04 | P0 | F3-05 | todo |
| F3-07 | WineCard, EntityCard, CompactResult | Estados; testes | P0 | F1-16 | todo |

## Fase 4 — Páginas de entidade

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F4-01 | Página do vinho (FactSheet, GrapeComposition, SensoryProfile, SourceList, relacionados) | Campos sem fonte ocultos; metadata; JSON-LD | P0 | F3-07 | todo |
| F4-02 | Uvas (lista + individual) | E2E-05 | P0 | F4-01 | todo |
| F4-03 | Regiões e países (lista + individual, hierarquia) | E2E-05 | P0 | F4-01 | todo |
| F4-04 | Produtores (lista + individual) | E2E-05 | P0 | F4-01 | todo |
| F4-05 | Vinícolas (só se houver dados reais distintos) | Sem páginas vazias | P2 | F4-04 | todo |
| F4-06 | Harmonizações (básico) | Linguagem de orientação; fontes | P1 | F4-01 | todo |
| F4-07 | `services/related.ts` (mesma região, mesma uva, mesmo produtor) | Testes unitários | P0 | F2-03 | todo |

## Fase 5 — Home e storytelling

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F5-01 | Home editorial (hero com busca + seções com layouts distintos) | Checklist `DESIGN.md` §14; LCP ≤ 2,5 s | P0 | F4-* | todo |
| F5-02 | Sobre (projeto, fontes, créditos de imagens, consumo responsável) | Todos os créditos listados | P1 | F4-* | todo |
| F5-03 | Explorar | Navegação visual por estilos/regiões/uvas | P2 | F4-* | todo |

## Fase 6 — Favoritos

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F6-01 | Store Zustand `persist` com versão, validação Zod e storage seguro | Testes: corrompido, indisponível, ids inválidos | P1 | F2-01 | todo |
| F6-02 | FavoriteButton + página `/favoritos` com EmptyState | E2E-06 | P1 | F6-01 | todo |

## Fase 7 — Animações

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F7-01 | Instalar Motion (LazyMotion) + MotionConfig reduzido | Bundle dentro do orçamento | P2 | F5-01 | todo |
| F7-02 | Implementar catálogo A01–A18 onde aplicável | E2E-09; sem regressão de INP | P2 | F7-01 | todo |
| F7-03 | Avaliar View Transitions (A16) | Decisão registrada | P3 | F7-02 | todo |

## Fase 8 — 3D

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F8-01 | Definir uso do 3D + obter modelo GLB licenciado (CC0 ou próprio) | Licença registrada; ≤ 500 KB | P2 | F5-01 | todo |
| F8-02 | Cena R3F sob demanda + detecção de capacidade + fallback real | Lighthouse ≥ 90 com e sem 3D | P2 | F8-01 | todo |

## Fase 9 — Mapas

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F9-01 | Escolher provedor de tiles (ADR-015) + dados GeoJSON com fonte | ADR atualizado | P2 | F4-03 | todo |
| F9-02 | RegionMap (MapLibre sob demanda, atribuição, alternativa textual) | a11y §3.6 | P2 | F9-01 | todo |

## Fase 10 — SEO, acessibilidade, performance e segurança

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F10-01 | Sitemap, robots, OG, JSON-LD completos | Checklist `SEO.md` §8 | P0 | F4-* | todo |
| F10-02 | Auditoria axe + manual (NVDA, teclado, zoom) | 0 violações sérias | P0 | F5-01 | todo |
| F10-03 | Lighthouse CI + bundle analyzer + orçamentos | Metas `PERFORMANCE.md` | P0 | F5-01 | todo |
| F10-04 | Revisão de segurança (skill `security-review`) + avaliar CSP com SRI | Relatório e correções | P1 | F1-11 | todo |

## Fase 11 — Deploy

| ID | Descrição | Critério de aceite | Prior. | Depende de | Status |
|---|---|---|---|---|---|
| F11-01 | Projeto na Vercel + variáveis de ambiente (**só com autorização do usuário**) | Preview funcionando, com `noindex` em previews | P0 | F10-* | todo |
| F11-02 | Domínio + produção | Site publicado; checklist de deploy | P1 | F11-01 | todo |
