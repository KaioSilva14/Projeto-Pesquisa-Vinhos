# DECISIONS — Registro de decisões (ADR curto)

> Formato: **Contexto → Decisão → Consequências → Data → Status**.
> Status: `proposta` (aguardando aprovação do usuário) · `aceita` · `substituída por ADR-xxx`.
> As decisões da Fase 0 foram aprovadas pelo usuário em 2026-09-28.

---

## ADR-001 — Nome provisório "Vinum"
- **Contexto**: o `CLAUDE.md` define "Vinum" como nome de trabalho, possivelmente trocável.
- **Decisão**: usar "Vinum" em documentos e código, centralizado em uma constante (`src/config/site.ts`) para troca fácil.
- **Consequências**: trocar o nome depois exige alterar 1 constante + textos de docs. Verificar disponibilidade de domínio/marca antes do lançamento.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-002 — npm como gerenciador de pacotes
- **Contexto**: o usuário é iniciante, usa Windows 11 e o projeto está no OneDrive. O pnpm usa links simbólicos/hard links que podem gerar atrito no Windows e com sincronização.
- **Decisão**: **npm** (já instalado, 11.17.0). `package-lock.json` versionado; `npm ci` no CI.
- **Consequências**: instalação um pouco mais lenta e `node_modules` maior que no pnpm; zero configuração extra.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-003 — Versões da stack base; TypeScript 6.0 (não 7.0)
- **Contexto**: em 2026-09-28 as versões estáveis no npm são Next 16.3.6, React 19.3.0, TypeScript 7.0.2 e Tailwind 4.3.3. O `typescript-eslint` 8.71 (usado pelo `eslint-config-next`) declara compatibilidade `typescript >=4.8.4 <6.1.0`.
- **Decisão**: Next **16.3.6**, React **19.3.0**, TypeScript **6.0.3**, Tailwind **4.3.3**, Node **24 LTS**. Versões exatas no `package.json`.
- **Consequências**: lint funciona sem incompatibilidades. Reavaliar TS 7 quando o `typescript-eslint` suportar.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-004 — Tailwind v4 com tokens CSS (`@theme`)
- **Contexto**: o design system precisa de tokens centralizados e de tema claro/escuro.
- **Decisão**: tokens como variáveis CSS em `src/styles/globals.css` (bloco `@theme`), sem `tailwind.config.js`. Plugin PostCSS `@tailwindcss/postcss`.
- **Consequências**: uma única fonte de tokens para Tailwind e CSS puro; o tema escuro troca só variáveis.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-005 — Radix (pacote `radix-ui`) + componentes próprios com CVA, sem o CLI do shadcn
- **Contexto**: precisamos de primitivos acessíveis sem visual imposto. O shadcn/ui gera código com visual padrão reconhecível e dependências extras.
- **Decisão**: usar o pacote unificado `radix-ui` e escrever os componentes em `components/ui/` com CVA + `cn()`. O shadcn/ui serve apenas como **referência de código**.
- **Consequências**: um pouco mais de código próprio; identidade visual garantida; menos dependências.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-006 — Ícones Phosphor
- **Contexto**: o `CLAUDE.md` permite Lucide ou Phosphor. O Lucide é muito associado a interfaces genéricas.
- **Decisão**: `@phosphor-icons/react` (pesos `regular` e `light`), importando do entrypoint SSR em Server Components.
- **Consequências**: família única; import por ícone mantém o bundle pequeno.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-007 — Motion como única biblioteca de animação JS
- **Contexto**: o `CLAUDE.md` pede para evitar sobreposição Motion × GSAP e trata o Lenis como opcional.
- **Decisão**: **Motion** (`motion/react`, com `LazyMotion`) para presença/layout/sequência; CSS para microinterações. **GSAP e Lenis não serão usados**.
- **Consequências**: sem scroll-jacking/pinning complexo (não precisamos). Se um storytelling por scroll exigir GSAP no futuro, abrir novo ADR.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-008 — Busca com Fuse.js sob demanda; filtros no servidor
- **Contexto**: catálogo pequeno/médio na v1; SEO e compartilhamento exigem filtros na URL; performance exige pouco JS inicial.
- **Decisão**: autocomplete no cliente com Fuse.js e índice enxuto carregados **no primeiro foco**; página `/pesquisa` e filtros de `/vinhos` resolvidos **no servidor** via `searchParams` (validados com Zod), sincronizados no cliente com `nuqs`.
- **Consequências**: funciona sem JS; URLs compartilháveis; páginas filtradas são dinâmicas (custo de servidor baixo). Limite de escala documentado em `ARCHITECTURE.md` §8.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-009 — Dados locais tipados + Zod + `services/` server-only; separar `Wine` e `Vintage`
- **Contexto**: sem banco na v1; os dados precisam ser verificáveis e trocáveis depois; teor alcoólico e composição variam por safra.
- **Decisão**: dados em `src/data/*.ts` validados por Zod no build/CI; acesso só por `services/` (com `server-only`) via um adapter; `Wine` guarda dados estáveis e `Vintage` os que mudam por safra; `Sourced<T>` por campo.
- **Consequências**: mudar para banco = novo adapter. A curadoria manual exige disciplina (processo em `DATA_SOURCES.md`).
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-010 — Tema claro e escuro por tokens, seguindo o sistema
- **Contexto**: o `CLAUDE.md` pede dark/light "só se fizer sentido". Leitura noturna no celular é comum, e o custo é baixo se os tokens forem semânticos desde o início.
- **Decisão**: tema claro como identidade principal; tema escuro via tokens, ativado por `prefers-color-scheme`. Seletor manual opcional na v1 (via `data-theme`).
- **Consequências**: todo componente é testado nos dois temas (axe em ambos). Fotos não recebem filtro.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-011 — Tipografia: Newsreader (títulos) + Hanken Grotesk (interface)
- **Contexto**: o `CLAUDE.md` pede serifada editorial + sans legível. Evitar fontes associadas a templates de IA (Inter, Fraunces, Instrument Serif).
- **Decisão**: **Newsreader** (serifada editorial com tamanho óptico) e **Hanken Grotesk** (sans), ambas com licença OFL, via `next/font/google` (self-host no build).
- **Consequências**: 2 famílias variáveis; testar acentuação e números tabulares na Fase 1. Alternativa, se não agradar: Source Serif 4 + Public Sans.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-012 — Consumo responsável e verificação de idade
- **Contexto**: no Brasil, vender ou fornecer bebida alcoólica a menores de 18 anos é crime (Estatuto da Criança e do Adolescente, art. 243). A publicidade de bebidas alcoólicas é regulada pela Lei 9.294/1996 e pela autorregulamentação do CONAR. O Vinum **não vende nem faz publicidade**, mas trata de bebidas alcoólicas.
- **Decisão (do usuário)**: **nenhuma verificação de idade** (nem tela, nem faixa de confirmação), por não ser um site de venda. Mantidos: (1) aviso permanente de consumo responsável e "proibido para menores de 18 anos" no rodapé e na página Sobre (exigido pelo `CLAUDE.md` §21); (2) linguagem estritamente informativa.
- **Consequências**: nenhuma barreira de entrada, melhor acessibilidade e SEO. Recomendável uma consulta jurídica simples antes do lançamento público; se algum dia for exigido, uma faixa não bloqueante pode ser adicionada sem mudar a arquitetura.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-013 — Imagens armazenadas localmente com metadados
- **Contexto**: hotlink de terceiros pode quebrar, violar termos ou exigir `remotePatterns`.
- **Decisão**: copiar imagens licenciadas para `public/images/{tipo}/`, com metadados `ImageAsset` em `src/data/images.ts`.
- **Consequências**: o repositório cresce (monitorar; se passar de ~200 MB, avaliar Vercel Blob ou Git LFS). Controle total de disponibilidade.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-014 — Server Components e SSG por padrão
- **Contexto**: SEO, performance e simplicidade.
- **Decisão**: páginas de entidade SSG com `generateStaticParams` e `dynamicParams = false`; dinâmicas só `/vinhos` (filtros) e `/pesquisa`; `"use client"` só em ilhas interativas. `cacheComponents` desativado na v1.
- **Consequências**: mudanças de dados exigem novo deploy (aceitável na v1).
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-015 — Mapas com MapLibre GL (provedor de tiles a decidir na fase 9)
- **Contexto**: mapas reais são obrigatórios; mapa desenhado é proibido. Os servidores de tiles públicos do OpenStreetMap têm política de uso que desaconselha uso intensivo por aplicações.
- **Decisão**: MapLibre GL, carregado sob demanda. Provedor a escolher na fase 9 entre OpenFreeMap (sem chave), MapTiler (chave, plano gratuito) ou PMTiles auto-hospedado (Protomaps). Atribuição sempre visível.
- **Consequências**: a CSP precisará liberar o domínio do provedor em `connect-src`/`img-src`.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28); provedor de tiles decidido na fase 9

## ADR-016 — Mover o projeto para fora do OneDrive
- **Contexto**: o projeto está em `C:\Users\joaov\OneDrive\Desktop\Projeto-Vinhos`. O OneDrive tenta sincronizar dezenas de milhares de arquivos de `node_modules`/`.next`/`.git`, o que causa lentidão, arquivos travados (`EPERM`, `EBUSY`) e conflitos.
- **Decisão (recomendada)**: antes da Fase 1, mover a pasta para `C:\dev\Projeto-Vinhos` (o backup passa a ser o GitHub).
- **Consequências**: reabrir a pasta no VS Code no novo local. Alternativa, se o usuário preferir ficar no OneDrive: excluir as pastas pesadas da sincronização (menos confiável).
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-017 — Lint com ESLint CLI (flat config) e scaffold manual
- **Contexto**: o Next 16 removeu o comando `next lint`. O `create-next-app` recusa pastas com arquivos que possam conflitar.
- **Decisão**: `eslint.config.mjs` com `eslint-config-next` (core-web-vitals + typescript) rodado via `eslint .`; scaffold da Fase 1 feito manualmente (`npm init` + instalação explícita de cada pacote).
- **Consequências**: mais controle e aprendizado sobre cada arquivo de configuração.
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28)

## ADR-018 — Documentação em `docs/`
- **Contexto**: o usuário pediu para organizar os documentos Markdown em uma pasta. O `CLAUDE.md` permite "na raiz ou em /docs".
- **Decisão**: todos os documentos ficam em `docs/`. Na raiz ficam apenas `CLAUDE.md` (lido pelo Claude Code e não deve ser alterado) e `README.md` (exibido pelo GitHub).
- **Consequências**: `MEMORY.md` e `TASKS.md` devem ser lidos em `docs/` no início de cada sessão.
- **Data**: 2026-09-28 · **Status**: **aceita** (pedido do usuário)

## ADR-019 — Países do catálogo inicial
- **Contexto**: o catálogo precisa começar pequeno e verificado; o usuário escolheu o foco geográfico.
- **Decisão**: escopo inicial restrito a **Itália, França, Espanha, Estados Unidos, Argentina e Brasil**. Crescimento em lotes (regiões e uvas, depois produtores, depois vinhos), conforme `DATA_SOURCES.md` §8.
- **Consequências**: fontes institucionais priorizadas por país (eAmbrosia, MASAF, INAO, MAPA, TTB, INV, Embrapa, INPI). Filtros e páginas de país só mostram esses 6 países. Outros países só entram com novo ADR.
- **Data**: 2026-09-28 · **Status**: aceita (pedido do usuário)

## ADR-020 — Identidade visual sem referências externas
- **Contexto**: o usuário informou que não há referências visuais (sites, prints ou arquivos).
- **Decisão**: a identidade visual segue exclusivamente o `DESIGN.md` (paleta "Adega", Newsreader + Hanken Grotesk, raios e componentes definidos).
- **Consequências**: qualquer mudança visual relevante passa por atualização do `DESIGN.md` antes do código.
- **Data**: 2026-09-28 · **Status**: aceita (pedido do usuário)

## ADR-021 — `AGENTS.md` na raiz para proteger o `CLAUDE.md`
- **Contexto**: o `next dev` 16 detecta quando é executado por um agente de IA e insere um bloco de regras no `AGENTS.md` ou, se ele não existir, no fim do `CLAUDE.md` (`node_modules/next/dist/server/lib/generate-agent-files.js`). Não há opção para desligar. O `CLAUDE.md` não deve ser alterado (pedido do usuário).
- **Decisão**: manter um `AGENTS.md` na raiz, versionado, contendo o bloco gerenciado pelo Next. Com ele presente, o Next escreve apenas nesse arquivo.
- **Consequências**: exceção ao ADR-018 (a raiz passa a ter `CLAUDE.md`, `README.md` e `AGENTS.md`). O bloco aponta a documentação da versão instalada em `node_modules/next/dist/docs/`, útil para consultar APIs do Next 16. Não apagar o `AGENTS.md`: sem ele o `CLAUDE.md` volta a ser modificado.
- **Data**: 2026-09-28 · **Status**: aceita
