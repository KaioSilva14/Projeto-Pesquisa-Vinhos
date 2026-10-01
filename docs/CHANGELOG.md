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
- 2026-09-29: primeiros dados reais: 10 uvas com fatos das fichas do VIVC (F2-06) e 9 fotos do VIVC/JKI com crédito e permissão de reprodução (F2-06b, ADR-024); o `validate:data` passa a conferir se o arquivo de cada imagem existe.
- 2026-09-30: F2-07, 6 países e 10 regiões com fontes oficiais (regulamentos, interprofissões, TTB, INV, Embrapa) e ligação uva ↔ região nos dois sentidos.
- 2026-09-30: F2-08, 7 produtores, 13 vinhos e 12 safras com dados das fichas técnicas oficiais (teor alcoólico, composição de uvas, estágio), sem estimar campos que a ficha não informa.

- 2026-09-30: F2-09, tabela sensorial revisada contra as fichas reais (nenhum termo novo; ADR-025) e campo `sparklingSweetness` para a categoria de doçura declarada dos espumantes. **Fase 2 concluída.**

- 2026-09-30: Fase 3 iniciada. Busca tolerante a acentos e erros de digitação (`src/lib/search/`, ADR-026), índice estático em `/api/search-index` (F3-02) e página `/pesquisa` com filtro por tipo e paginação, funcionando sem JavaScript (F3-04).
- 2026-09-30: F3-03, autocomplete acessível (combobox WAI-ARIA) no cabeçalho e em `/pesquisa`: sugestões agrupadas por tipo, índice baixado só no primeiro foco, atalhos `/` e `Ctrl+K`.
- 2026-09-30: F3-05 a F3-07, página `/vinhos` com filtros combinados (tipo, país, região, uva, produtor) na URL, contagem por opção, filtros ativos removíveis, ordenação, "Carregar mais", painel inferior no celular e `WineCard`. **Fase 3 concluída.**
- 2026-09-30: F4-01 e F4-07, página de cada vinho (`/vinhos/[slug]`, estática): ficha técnica em blocos, safras, perfil sensorial só com fonte, relacionados pelos dados, lista de fontes com nota numerada em cada fato, metadados e JSON-LD sem preço.
- 2026-09-30: F4-02, lista `/uvas` com cards (foto real com botão "Créditos", contagem de vinhos) e página de cada uva (ficha do VIVC, regiões onde é principal, vinhos com a uva, fontes numeradas, JSON-LD Article).
- 2026-09-30: F4-03, `/regioes` (agrupadas por país), página de cada região (denominação, uvas principais com a nota da fonte, produtores, vinhos, fontes; JSON-LD Place), `/paises` e página de cada país.
- 2026-09-30: F4-04, `/produtores` e página de cada produtor (ficha com site oficial, fundação e cidade quando a fonte informa, história, vinhos, fontes; JSON-LD Organization). F4-05 (vinícolas) sem dados distintos: sem páginas vazias.
- 2026-09-30: F4-08 (1ª parte), fotos reais das 10 regiões e de 6 dos 7 produtores, do Wikimedia Commons (CC BY, CC BY-SA, CC0), com autor, licença e origem no site e em `public/images/CREDITOS.md`.
- 2026-09-30: F4-08 (2ª parte), fotos das garrafas de 8 vinhos tiradas dos sites oficiais dos produtores, com crédito (ADR-028); cards de vinho passam a mostrar a garrafa (`WineGrid`).
- 2026-09-30: todas as entidades com foto: garrafas dos 5 vinhos que faltavam (biblioteca de mídia dos sites e fichas técnicas em PDF), vinícola La Rioja Alta (site oficial) e Torrontés Riojano (relatório do INV, CC BY 4.0).
- 2026-10-01: F4-06, harmonizações sugeridas pelos produtores (`/harmonizacoes` e seção na página do vinho). **Fase 4 concluída.**
- 2026-10-01: Fase 5, home editorial com busca em destaque e seções do catálogo, página Sobre com todos os créditos de imagens e página Explorar. **Fase 5 concluída.**
- 2026-10-01: Fase 6, favoritos no navegador (sem conta): coração nas páginas e cards de vinho, uva, região e produtor, página `/favoritos`, proteção contra dado corrompido ou armazenamento bloqueado. **Fase 6 concluída.**
- 2026-10-01: Fase 7, animações só com CSS (ADR-029): entrada suave das seções da home, foto do card crescendo no hover, coração que pulsa ao favoritar e sombra do cabeçalho ao rolar; tudo desligado com movimento reduzido e visível sem JavaScript. **Fase 7 concluída.**
- 2026-10-01: itens básicos de site profissional (F10-05, ADR-031): chamada para explorar na primeira seção da home, 5 perguntas frequentes, política de privacidade, página "Sugerir uma correção" (abre uma issue no GitHub) com página de agradecimento, mensagens de erro úteis e limite de caracteres com contador.
- 2026-10-01: SEO técnico (F10-01): `sitemap.xml`, `robots.txt`, imagem para redes sociais em todas as páginas, favicon e ícone do iPhone, perguntas frequentes nos dados estruturados; títulos e descrições dentro do limite de caracteres.
- 2026-10-01: qualidade das imagens (F10-06, ADR-030): garrafas pequenas trocadas por versões maiores (Miolo Lote 43 2012, Catena Malbec, Catena Zapata Malbec Argentino), tamanho mínimo barrado pelo validador, fotos nunca esticadas, compressão com qualidade 85 e moldura branca para garrafas.
- 2026-10-01: ícones completos (F10-07, ADR-032): `favicon.ico`, ícones de 32 a 512 px, ícone do iPhone, ícone "maskable" do Android e manifesto do app.
- 2026-10-01: revisão geral (F10-08): fontes dentro do orçamento (de ~508 KB para 90 KB pré-carregados), Rías Baixas com o caderno de especificações vigente (2024), Chianti Classico com as regras de 2023 (Gran Selezione), README atualizado; varredura sem links quebrados nem violações de acessibilidade.
- 2026-10-01: Fase 8 encerrada sem 3D (ADR-032): a garrafa 3D foi testada e removida a pedido do usuário; a abertura da home ganhou uma foto real de vinhedo (Mendoza) em telas largas.
- 2026-10-01: Fase 9, mapas reais (ADR-033): seção "Onde fica" nas regiões e mapa com os pontos das regiões nos países (Leaflet + OpenStreetMap, só quando a pessoa clica em "Mostrar o mapa"); cada marcador indica o lugar retratado na foto da região, com fonte, e o texto deixa claro que os limites não estão desenhados. Política de privacidade atualizada. **Fase 9 concluída.**
- 2026-10-01: README novo: banner animado (claro e escuro, parado com "reduzir movimento"), demonstração animada da busca gravada do site, capturas reais (home, vinho, mapa, celular), diagrama da arquitetura e instruções de instalação recolhíveis. Arquivos em `.github/readme/`; banner gerado por `scripts/readme-banner.mjs`.
- 2026-10-01: Fase 10 (F10-02 a F10-04): Lighthouse CI no PR com notas mínimas e orçamento de JavaScript por página (ADR-035), testes automáticos de reflow, espaçamento de texto e foco, roteiro de teste com NVDA e revisão de segurança (nome no marcador do mapa agora é texto puro; SRI testado e não adotado).
- 2026-10-01: **Fase 11, site publicado** em https://vinum-vinhos.vercel.app (ADR-036): projeto na Vercel ligado ao GitHub, publicação automática a cada merge no `main` e prévia em cada PR. README atualizado com o link do site, as notas do Lighthouse, a publicação e um diagrama mais legível.

### Alterado
- 2026-09-30: composição de uvas com soma abaixo de 99% passa a ser aceita quando a nota explica o que falta (uva fora do catálogo), em vez de ser sempre rejeitada.
- 2026-09-28: ESLint 9.39.5 no lugar do 10.11.0 previsto (ADR-022); `vite` e `@testing-library/dom` incluídos como peer dependencies obrigatórias.
- 2026-09-28: Fase 0 aprovada. Decisões ADR-001 a ADR-018 aceitas; ADR-012 atualizado (sem verificação de idade); novos ADR-019 (países do catálogo: Itália, França, Espanha, EUA, Argentina, Brasil) e ADR-020 (identidade visual só pelo `DESIGN.md`).
