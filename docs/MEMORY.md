# MEMORY — Memória do projeto entre sessões

> Ler no início de toda sessão (junto com `CLAUDE.md` e `docs/TASKS.md`). Atualizar ao final de cada sessão.

---

## Estado atual (2026-09-30)

- **Fase 0 concluída e APROVADA pelo usuário** em 2026-09-28. Todas as decisões (ADR-001 a ADR-020) estão aceitas. Na Fase 1 entraram ADR-021 (`AGENTS.md`) e ADR-022 (ESLint 9).
- **Fase 1 concluída** (F1-01 a F1-16) em 2026-09-28. Projeto em `C:\dev\Projeto-Vinhos` (o Windows exibe `C:\Dev`). Repositório: https://github.com/KaioSilva14/Projeto-Pesquisa-Vinhos.
  - PR #1 (fundação) e PR #2 (layout, estados, mídia) mesclados no `main`. A F1-13 (Radix) está no branch `feat/radix`, aguardando o PR #3.
  - Fluxo de trabalho combinado: um branch por bloco de tarefas → push → **o usuário abre o PR e faz o merge pelo site** (o `gh` não está instalado) → eu confiro o CI pela API pública e atualizo o `main` local.
- **O que existe no código**:
  - Next 16.3.6 + React 19.3.0 + TS 6.0.3 estrito; Tailwind 4.3.3 com tokens em `src/styles/globals.css` (fonte da verdade do design system); fontes em `src/styles/fonts.ts`.
  - `src/components/ui/`: Button, IconButton, Input, SearchInput, Badge, FilterChip, ActiveFilterChip, Card/CardLink, Skeleton, Dialog, Sheet, Popover, Tooltip, Select, Checkbox, Accordion, Tabs. Ícones só via `icons.ts`.
  - `src/components/layout/` (cabeçalho, rodapé com aviso 18+, BottomNav, trilha, PageHeader, Section, Container), `states/` (vazio, sem resultados, erro, dados incompletos, selo demo), `media/` (EntityImage, ImageUnavailable, ImageCredit).
  - `src/app/`: home provisória, `not-found.tsx`, `error.tsx` (usa `retry`, API do Next 16), `global-error.tsx`, página interna `/dev/design-system` (só em dev).
  - `src/config/` (env com Zod, headers de segurança, menus, site), `src/lib/` (cn, normalize), `src/schemas/image-asset.ts` (adiantado da F2-01).
  - Qualidade: Husky + lint-staged, CI no GitHub Actions. Testes: 93 unitários/componente, 61 E2E (5 perfis de navegador), axe sem violações.
- **Fase 2 em andamento**. PR #4 (F2-05, F2-01, F2-02) mesclado. Branch atual `feat/camada-dados` (F2-03, F2-04), PR #5 a abrir.
  - **F2-05**: catálogo aprovado em `docs/CURATION.md` (ADR-023): 10 regiões, 10 uvas, 7 produtores (Miolo com ressalva; Chianti Classico sem produtor).
  - **F2-01**: schemas Zod estritos em `src/schemas/` (um arquivo por entidade + `common.ts` e `catalog.ts`).
  - **F2-02**: `npm run validate:data` (`scripts/validate-data.ts` + `src/lib/validation/`), no CI.
  - **F2-03**: `src/adapters/` (DataAdapter + adapter local) e `src/services/` (todos com `import "server-only"`); as páginas usam `catalogService` de `@/services`.
  - **F2-04**: dados fictícios em `src/data/demo/` (5 vinhos "Vinho Exemplo 0X (demonstração)", país "xx"), carregados só com `NEXT_PUBLIC_ENABLE_DEMO_DATA=true`. O catálogo real (`src/data/*.ts`) ainda está **vazio**.
- **F2-06 e F2-06b concluídas**: 10 uvas reais em `src/data/grapes.ts` (fontes: fichas do VIVC em `src/data/sources.ts`) e 9 fotos do VIVC/JKI em `public/images/grapes/` com crédito exato (`src/data/images.ts`, `public/images/CREDITOS.md`, ADR-024). A janela de cada foto no VIVC diz "This photo can be reproduced. Please quote the source". Torrontés Riojano sem foto. Dados extraídos do HTML bruto do VIVC (não do resumo da WebFetch, que pode errar).
- **F2-07 concluída** (branch `data/regioes`, PR #8 a abrir): 6 países (`src/data/countries.ts`) e 10 regiões (`src/data/regions.ts`) com fontes oficiais (MASAF, CIVB, Comité Champagne, DOCa Rioja, BOE, TTB, INV, Embrapa; NVV como secundária). `mainRegionIds` das uvas derivado das regiões. Pendência: Torrontés Riojano ↔ Valle de Cafayate sem fonte específica.
- **F2-08 concluída** (branch `data/produtores`, PR #9 a abrir): 7 produtores (`src/data/producers.ts`), 13 vinhos (`src/data/wines.ts`) e 12 safras (`src/data/vintages.ts`), com 14 fontes de fichas técnicas e páginas oficiais. Uvas fora do catálogo (Cabernet Franc, Petit Verdot, Meunier, Graciano) só aparecem nas notas das composições. Sem teor alcoólico quando a ficha não informa (Vajra, Palmer, Roederer, La Rioja Alta, Miolo). Sem perfil sensorial (termos em outras línguas; F2-09).
- **F2-09 concluída — Fase 2 concluída** (branch `data/termos-sensoriais`, PR #10 a abrir; ADR-025): as fichas descrevem os vinhos em prosa, sem termos de escala, então a tabela sensorial não ganhou termos e os vinhos reais ficam sem corpo/acidez/taninos. Novo campo `Wine.sparklingSweetness` (só espumantes, termo declarado pelo produtor): só o Brut Nature da Roederer tem. Faixas de açúcar em g/l **não** registradas: o EUR-Lex bloqueia acesso automático (HTTP 202 vazio). Descritores em prosa dos produtores ficam para a Fase 4.
- **Fase 3 concluída**: F3-01 a F3-04 no `main` (PRs #11 e #12). F3-05 a F3-07 no branch `feat/catalogo-vinhos` (PR #13 a abrir): página `/vinhos` (`src/app/vinhos/page.tsx`), `lib/filters/` (puro + params `server-only`), `services/wine-list.ts`, `components/filters/` e `components/wine/WineCard.tsx`. Sem nuqs (ADR-027).
  - Busca própria palavra por palavra em `src/lib/search/search.ts` (ADR-026). O Fuse.js foi testado e removido: ele achava trechos dentro das palavras ("tinto" trazia "argentino").
  - Índice em `/api/search-index` (estático, 46 documentos, ~9 KB), montado por `lib/search/documents.ts` com os gentílicos de `lib/search/demonyms.ts`.
  - Página `/pesquisa` (dinâmica, noindex) com filtro por tipo (`?tipo=`) e paginação (`?pagina=`), funcionando sem JavaScript. Componentes em `src/components/search/`, `Pagination` e `FilterChipLink` em `ui/`.
  - `CompactResult` sem miniatura (foto exige crédito visível).
- **Próxima tarefa**: Fase 4, começando pela F4-01 (página do vinho). Pendências da Fase 3: filtro "uva principal"; foco após remover um chip (ACCESSIBILITY.md §3.2).
- **Cuidado com o Zod no navegador**: importar um módulo com Zod num Client Component leva o Zod ao bundle e dispara violação de CSP (`script-src: eval`, o Zod 4 testa `new Function`). Módulos com Zod usados só no servidor levam `import "server-only"`.
- **E2E contra build de produção** sem parar o dev: `$env:PW_PORT = "3200"; npm run test:e2e`. Contra o dev (3100), a compilação lenta gera falhas falsas.
- O usuário roda o próprio `npm run dev` (porta 3001). O Next 16 só permite um `next dev` por projeto: para prints em modo dev, usar o servidor dele em vez de iniciar outro (nunca encerrá-lo sem pedir).
- O usuário prefere que eu explique cada passo **enquanto** faço, em linguagem simples (pedido em 2026-09-28, após não entender onde estavam os commits).

## O que já foi feito

- Lido o `CLAUDE.md` (especificação; **não alterar**, pedido do usuário).
- Procuradas referências de design: nenhuma encontrada; o usuário confirmou que **não há** → seguir o `DESIGN.md` (ADR-020).
- Levantadas skills/MCPs do ambiente; consultada a skill `design-taste-frontend` para o design system.
- Conferidas no npm as versões atuais e as peer dependencies (resultado em `ARCHITECTURE.md` §2).
- Calculado o contraste WCAG da paleta proposta (resultado em `DESIGN.md` §2).
- Criados em `docs/`: PRD, ARCHITECTURE, DESIGN, RULES, DATA_MODEL, DATA_SOURCES, IMAGES, SEO, SECURITY, ACCESSIBILITY, PERFORMANCE, ANIMATIONS, TESTING, DECISIONS, TASKS, MEMORY, CHANGELOG.
- Criados na raiz: `README.md`, `.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `.env.example`, `.node-version`.
- A pedido do usuário, toda a documentação fica em `docs/` (ADR-018).

## Respostas do usuário (2026-09-28)

| Tema | Resposta |
|---|---|
| Documentos e decisões | Aprovados ("todas as decisões estão ótimas") |
| Nome | Vinum |
| Local do projeto | Mover para `C:\dev\Projeto-Vinhos` |
| Referências visuais | Não há; seguir `DESIGN.md` |
| Verificação de idade | **Nenhuma** (não é site de venda); só o aviso 18+ no rodapé/Sobre |
| Países do catálogo | **Itália, França, Espanha, Estados Unidos, Argentina, Brasil** (ADR-019) |

## Decisões principais (ver `DECISIONS.md`)

npm · Next 16.3.6 · React 19.3.0 · **TypeScript 6.0.3** (7.x ainda incompatível com o typescript-eslint) · Tailwind 4.3.3 · Radix (`radix-ui`) + CVA · Phosphor · Motion como única lib de animação · busca própria palavra por palavra (ADR-026) + filtros no servidor com nuqs · dados locais + Zod + services `server-only` · `Wine` × `Vintage` · tema claro + escuro por tokens · Newsreader + Hanken Grotesk · imagens locais com metadados · SSG por padrão.

## Pendências

- PR #13 (`feat/catalogo-vinhos` → `main`) a ser aberto e mesclado pelo usuário.
- Fontes pendentes: anexo III do Regulamento (UE) 2019/33 (faixas de açúcar dos espumantes; EUR-Lex bloqueia acesso automático); fonte específica para Torrontés Riojano ↔ Valle de Cafayate; alteração de 2023 do disciplinare do Chianti Classico; versões posteriores a 1997 do regulamento de Rías Baixas.
- Antes do lançamento público: consulta jurídica simples sobre conteúdo de bebidas alcoólicas (ADR-012).

## Problemas conhecidos

- O `next dev`, quando detecta um agente de IA, escreve um bloco de regras no `AGENTS.md` (ou no `CLAUDE.md`, se o `AGENTS.md` não existir). **Não apagar o `AGENTS.md`** (ADR-021).
- O ESLint 10 quebra os plugins do `eslint-config-next`, então fica fixado no 9.39.5 até eles suportarem o 10 (ADR-022).
- O npm 11 avisa sobre o script de instalação não aprovado do `unrs-resolver`: pode ignorar (ADR-022).
- Links para rotas que ainda não existem (fases 3 a 6) dão 404 no pré-carregamento do Next; no Chromium o Playwright vê essas requisições como "pendentes" para sempre. Por isso **não usar `waitForLoadState("networkidle")`** nos testes E2E.
- **`sharp` também bloqueado** pelo Controle Inteligente de Aplicativos (2026-09-29): localmente o `next/image` entrega a foto original, sem otimizar (funciona, mas sem AVIF/WebP). Medir desempenho (Lighthouse, fase 10) no CI ou na Vercel, não localmente. Redimensionar imagens com `System.Drawing` do PowerShell (sem instalar nada).
- **Firefox local bloqueado** (2026-09-29): o Controle Inteligente de Aplicativos do Windows 11 passou a bloquear o `firefox.exe` do Playwright (`spawn UNKNOWN`). Localmente os E2E rodam em Chromium e WebKit; o Firefox roda sempre no CI (`playwright.config.ts`, variável `PW_FIREFOX=1` para forçar). **Não** recomendar desligar a proteção do Windows.
- O Firefox do Playwright falhava de forma intermitente (erros gráficos internos, `GraphicsCriticalError`) quando rodavam 8 navegadores em paralelo (16 núcleos, pouca memória livre). Resolvido limitando a 4 workers locais em `playwright.config.ts`; no CI fica o padrão.
- No PowerShell 5.1, não editar arquivos com `Get-Content`/`Set-Content`: eles leem UTF-8 como ANSI e gravam BOM, corrompendo os acentos.
- Com a lista do `Select` aberta, o axe acusa `aria-hidden-focus`: falso positivo analisado (`ACCESSIBILITY.md` §5.1).

## Próximos passos

1. Depois do merge do PR #13: `git switch main`, `git pull`, apagar o branch local e criar um branch para a F4-01.
2. Na curadoria (F2-06+): só itens do `docs/CURATION.md`; cada fato conferido na fonte original, texto sempre próprio, commit do tipo `data:` citando as fontes.
3. Cada componente novo entra também na página `/dev/design-system` e passa pelo axe nos dois temas (o jsdom não aplica o CSS: problemas como `visibility: hidden` só aparecem no navegador).

## Links importantes

- Next.js: https://nextjs.org/docs
- Tailwind CSS v4: https://tailwindcss.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- WAI-ARIA APG (combobox): https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
