# MEMORY — Memória do projeto entre sessões

> Ler no início de toda sessão (junto com `CLAUDE.md` e `docs/TASKS.md`). Atualizar ao final de cada sessão.

---

## Estado atual (2026-09-28)

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
- **Fase 2 em andamento** (branch `data/curadoria`, enviado ao GitHub, PR #4 a abrir):
  - **F2-05 concluída**: catálogo aprovado em `docs/CURATION.md` (ADR-023): 10 regiões, 10 uvas, 7 produtores (Miolo com ressalva; Chianti Classico sem produtor).
  - **F2-01 concluída**: schemas Zod estritos em `src/schemas/` (um arquivo por entidade + `common.ts` e `catalog.ts`).
  - **F2-02 concluída**: `npm run validate:data` (`scripts/validate-data.ts` + `src/lib/validation/`), no CI. `src/data/` tem as coleções **vazias**.
- **Próxima tarefa**: F2-03 (adapter local + services `server-only`), F2-04 (dados demo fictícios), depois a curadoria real: F2-06 (uvas), F2-07 (países e regiões), F2-08 (produtores e vinhos). Os números de catálogo do VIVC e as fontes de cada item já estão em `docs/CURATION.md`.
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

npm · Next 16.3.6 · React 19.3.0 · **TypeScript 6.0.3** (7.x ainda incompatível com o typescript-eslint) · Tailwind 4.3.3 · Radix (`radix-ui`) + CVA · Phosphor · Motion como única lib de animação · Fuse.js sob demanda + filtros no servidor com nuqs · dados locais + Zod + services `server-only` · `Wine` × `Vintage` · tema claro + escuro por tokens · Newsreader + Hanken Grotesk · imagens locais com metadados · SSG por padrão.

## Pendências

- PR #4 (`data/curadoria` → `main`) a ser aberto e mesclado pelo usuário.
- Antes do lançamento público: consulta jurídica simples sobre conteúdo de bebidas alcoólicas (ADR-012).

## Problemas conhecidos

- O `next dev`, quando detecta um agente de IA, escreve um bloco de regras no `AGENTS.md` (ou no `CLAUDE.md`, se o `AGENTS.md` não existir). **Não apagar o `AGENTS.md`** (ADR-021).
- O ESLint 10 quebra os plugins do `eslint-config-next`, então fica fixado no 9.39.5 até eles suportarem o 10 (ADR-022).
- O npm 11 avisa sobre o script de instalação não aprovado do `unrs-resolver`: pode ignorar (ADR-022).
- Links para rotas que ainda não existem (fases 3 a 6) dão 404 no pré-carregamento do Next; no Chromium o Playwright vê essas requisições como "pendentes" para sempre. Por isso **não usar `waitForLoadState("networkidle")`** nos testes E2E.
- O Firefox do Playwright falhava de forma intermitente (erros gráficos internos, `GraphicsCriticalError`) quando rodavam 8 navegadores em paralelo (16 núcleos, pouca memória livre). Resolvido limitando a 4 workers locais em `playwright.config.ts`; no CI fica o padrão.
- No PowerShell 5.1, não editar arquivos com `Get-Content`/`Set-Content`: eles leem UTF-8 como ANSI e gravam BOM, corrompendo os acentos.
- Com a lista do `Select` aberta, o axe acusa `aria-hidden-focus`: falso positivo analisado (`ACCESSIBILITY.md` §5.1).

## Próximos passos

1. Depois do merge do PR #4: `git switch main`, `git pull`, apagar o branch local e criar um novo (ex.: `feat/camada-dados` para F2-03 e F2-04).
2. Na curadoria (F2-06+): só itens do `docs/CURATION.md`; cada fato conferido na fonte original, texto sempre próprio, commit do tipo `data:` citando as fontes.
3. Cada componente novo entra também na página `/dev/design-system` e passa pelo axe nos dois temas (o jsdom não aplica o CSS: problemas como `visibility: hidden` só aparecem no navegador).

## Links importantes

- Next.js: https://nextjs.org/docs
- Tailwind CSS v4: https://tailwindcss.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- WAI-ARIA APG (combobox): https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
