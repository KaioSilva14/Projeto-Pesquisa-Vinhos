# MEMORY — Memória do projeto entre sessões

> Ler no início de toda sessão (junto com `CLAUDE.md` e `docs/TASKS.md`). Atualizar ao final de cada sessão.

---

## Estado atual (2026-09-28)

- **Fase 0 concluída e APROVADA pelo usuário** em 2026-09-28. Todas as decisões (ADR-001 a ADR-020) estão aceitas. Na Fase 1 entraram ADR-021 (`AGENTS.md`) e ADR-022 (ESLint 9).
- **Fase 1 iniciada**. Projeto agora em `C:\dev\Projeto-Vinhos` (o Windows exibe `C:\Dev`).
  - F1-01: conteúdo da pasta antiga no OneDrive apagado (autorizado pelo usuário); restou só a pasta vazia `OneDrive\Desktop\Projeto-Vinhos`, travada pela janela antiga do VS Code. Apagar quando ela estiver fechada.
  - F1-02: concluída. Repositório: https://github.com/KaioSilva14/Projeto-Pesquisa-Vinhos (branch `main`, remoto `origin`; o push funciona com as credenciais do Git do usuário).
- **F1-03 a F1-08 concluídas** (sessão de 2026-09-28), no branch `feat/fundacao` (commits locais, **ainda sem push**; o `main` continua só com os docs).
  - Next 16.3.6 + React 19.3.0 + TS 6.0.3 estrito; Tailwind 4.3.3 com tokens em `src/styles/globals.css` (fonte da verdade do design system); fontes em `src/styles/fonts.ts`.
  - Página interna `/dev/design-system` (só em dev; 404 em produção) mostra todos os tokens. Axe: 0 violações nos dois temas.
  - `src/lib/cn.ts` (tailwind-merge configurado com os tokens) e `src/lib/normalize.ts`, com testes em `tests/unit/`.
  - Playwright (`tests/e2e/`, porta 3100, roda contra o build) + axe, em 5 perfis de navegador.
  - Tudo passando: `lint`, `format:check`, `typecheck`, `test` (14), `test:e2e` (20), `build`.
- **Próxima tarefa**: F1-09 (Husky + lint-staged); depois F1-10 (CI, exige push para o GitHub), F1-11, F1-12…

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

- Concluir F1-01: apagar a pasta vazia `OneDrive\Desktop\Projeto-Vinhos` quando a janela antiga do VS Code estiver fechada (pedir confirmação).
- Autorização do usuário para enviar o branch `feat/fundacao` ao GitHub (push) e abrir PR para o `main`.

## Problemas conhecidos

- O `next dev`, quando detecta um agente de IA, escreve um bloco de regras no `AGENTS.md` (ou no `CLAUDE.md`, se o `AGENTS.md` não existir). **Não apagar o `AGENTS.md`** (ADR-021).
- O ESLint 10 quebra os plugins do `eslint-config-next`, então fica fixado no 9.39.5 até eles suportarem o 10 (ADR-022).
- O npm 11 avisa sobre o script de instalação não aprovado do `unrs-resolver`: pode ignorar (ADR-022).
- No PowerShell 5.1, não editar arquivos com `Get-Content`/`Set-Content`: eles leem UTF-8 como ANSI e gravam BOM, corrompendo os acentos.

- O `create-next-app` não roda em pasta com arquivos existentes → scaffold manual (ADR-017).
- `eslint.config.mjs` e `.prettierrc` só funcionam depois da instalação das dependências (Fase 1).

## Próximos passos

1. F1-09 (Husky + lint-staged).
2. F1-10 (GitHub Actions), depois do push do branch.
3. F1-11 (headers de segurança + `env.ts`), F1-12 a F1-16 (componentes, layout, estados, mídia). Cada componente novo entra também na página `/dev/design-system`.

## Links importantes

- Next.js: https://nextjs.org/docs
- Tailwind CSS v4: https://tailwindcss.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- WAI-ARIA APG (combobox): https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
