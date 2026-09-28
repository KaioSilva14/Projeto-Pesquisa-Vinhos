# Changelog

Todas as mudanças relevantes do projeto são registradas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versionamento [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- 2026-09-28: documentação da Fase 0 em `docs/` (PRD, arquitetura, design system, regras, modelo de dados, fontes, imagens, SEO, segurança, acessibilidade, performance, animações, testes, decisões, tarefas, memória).
- 2026-09-28: arquivos de configuração do repositório (`.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `.env.example`, `.node-version`) e `README.md`.

- 2026-09-28: Fase 1 (F1-03 a F1-08): scaffold Next.js 16 + React 19 + TypeScript 6 estrito; Tailwind v4 com os tokens do design system (claro/escuro) e página interna `/dev/design-system`; fontes Newsreader e Hanken Grotesk via `next/font`; ESLint 9 + Prettier; Vitest com testes de `cn` e `normalize`; Playwright + axe com o primeiro E2E da home; `AGENTS.md` (ADR-021).

### Alterado
- 2026-09-28: ESLint 9.39.5 no lugar do 10.11.0 previsto (ADR-022); `vite` e `@testing-library/dom` incluídos como peer dependencies obrigatórias.
- 2026-09-28: Fase 0 aprovada. Decisões ADR-001 a ADR-018 aceitas; ADR-012 atualizado (sem verificação de idade); novos ADR-019 (países do catálogo: Itália, França, Espanha, EUA, Argentina, Brasil) e ADR-020 (identidade visual só pelo `DESIGN.md`).
