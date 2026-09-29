# Changelog

Todas as mudanças relevantes do projeto são registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- 2026-09-28: documentação da Fase 0 em `docs/` (PRD, arquitetura, design system, regras, modelo de dados, fontes, imagens, SEO, segurança, acessibilidade, performance, animações, testes, decisões, tarefas, memória).
- 2026-09-28: arquivos de configuração do repositório (`.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `.env.example`, `.node-version`) e `README.md`.

- 2026-09-28: Fase 1 (F1-03 a F1-08): scaffold Next.js 16 + React 19 + TypeScript 6 estrito; Tailwind v4 com os tokens do design system (claro/escuro) e página interna `/dev/design-system`; fontes Newsreader e Hanken Grotesk via `next/font`; ESLint 9 + Prettier; Vitest com testes de `cn` e `normalize`; Playwright + axe com o primeiro E2E da home; `AGENTS.md` (ADR-021).
- 2026-09-28: Fase 1 (F1-09 a F1-16): Husky + lint-staged; CI no GitHub Actions; headers de segurança, CSP e validação de variáveis de ambiente; componentes base (botões, campos, chips, card, skeleton); layout (cabeçalho, rodapé com aviso 18+, navegação inferior, trilha de navegação); estados e páginas de erro (404, erro, erro global); componentes de imagem com "Imagem indisponível" e schema `ImageAsset`.
- 2026-09-28: F1-13, componentes interativos sobre Radix (Dialog, Sheet, Popover, Tooltip, Select, Checkbox, Accordion, Tabs) com animações do catálogo e token `--color-scrim`. **Fase 1 concluída.**
- 2026-09-29: Fase 2 (F2-05, F2-01 a F2-04): catálogo inicial aprovado (`CURATION.md`, ADR-023); schemas Zod estritos de todas as entidades; `npm run validate:data` no CI; adapter local e services `server-only`; dados de demonstração fictícios em `src/data/demo/`.

### Alterado
- 2026-09-28: ESLint 9.39.5 no lugar do 10.11.0 previsto (ADR-022); `vite` e `@testing-library/dom` incluídos como peer dependencies obrigatórias.
- 2026-09-28: Fase 0 aprovada. Decisões ADR-001 a ADR-018 aceitas; ADR-012 atualizado (sem verificação de idade); novos ADR-019 (países do catálogo: Itália, França, Espanha, EUA, Argentina, Brasil) e ADR-020 (identidade visual só pelo `DESIGN.md`).
