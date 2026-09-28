# MEMORY — Memória do projeto entre sessões

> Ler no início de toda sessão (junto com `CLAUDE.md` e `docs/TASKS.md`). Atualizar ao final de cada sessão.

---

## Estado atual (2026-09-28)

- **Fase 0 concluída e APROVADA pelo usuário** em 2026-09-28. Todas as decisões (ADR-001 a ADR-020) estão aceitas.
- **Fase 1 iniciada**. Projeto agora em `C:\dev\Projeto-Vinhos` (o Windows exibe `C:\Dev`).
  - F1-01: conteúdo da pasta antiga no OneDrive apagado (autorizado pelo usuário); restou só a pasta vazia `OneDrive\Desktop\Projeto-Vinhos`, travada pela janela antiga do VS Code. Apagar quando ela estiver fechada.
  - F1-02: concluída. Repositório: https://github.com/KaioSilva14/Projeto-Pesquisa-Vinhos (branch `main`, remoto `origin`; o push funciona com as credenciais do Git do usuário).
- **Nenhum código de aplicação** foi escrito ainda. Não há `package.json` nem `node_modules`.
- **Próxima tarefa**: F1-03 (scaffold manual do Next.js).

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

- Concluir F1-01: abrir o VS Code em `C:\dev\Projeto-Vinhos` e, após conferir, apagar a cópia antiga no OneDrive (pedir confirmação antes de apagar).
- F1-02: criar o repositório no GitHub (pedir autorização antes de publicar).
- F1-03 em diante: scaffold manual.

## Problemas conhecidos

- O `create-next-app` não roda em pasta com arquivos existentes → scaffold manual (ADR-017).
- `eslint.config.mjs` e `.prettierrc` só funcionam depois da instalação das dependências (Fase 1).

## Próximos passos

1. Continuar a Fase 1 a partir de `C:\dev\Projeto-Vinhos`, na ordem do `TASKS.md`.

## Links importantes

- Next.js: https://nextjs.org/docs
- Tailwind CSS v4: https://tailwindcss.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- WAI-ARIA APG (combobox): https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
