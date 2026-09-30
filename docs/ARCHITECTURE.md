# ARCHITECTURE — Vinum

> Versão 0.1 · Fase 0 · 2026-09-28
> Decisões detalhadas (contexto → decisão → consequências) em `DECISIONS.md`.

---

## 1. Visão geral

Site **Next.js (App Router)** com renderização **estática por padrão** (SSG), dados **locais tipados e validados** com Zod, uma camada de **serviços** que esconde de onde os dados vêm, e poucas **ilhas interativas** no cliente (busca, filtros, favoritos, animações, 3D, mapas).

Princípio: **servidor faz o trabalho pesado, cliente só o que precisa ser interativo.**

---

## 2. Stack final

Versões consultadas no registro do npm em **2026-09-28**. Fixar versões exatas no `package.json` na Fase 1 (sem `^` para libs críticas até o CI estar estável).

### 2.1 Base

| Pacote | Versão | Uso | Justificativa | Alternativa considerada |
|---|---|---|---|---|
| Node.js | 24.x LTS (instalado: 24.19.0) | Execução | Exigido pelo Next (≥ 20.9); LTS = suporte longo | — |
| npm | 11.x (instalado: 11.17.0) | Pacotes | Já vem com o Node; zero atrito no Windows (ADR-002) | pnpm (mais rápido, mas exige setup extra e tem atritos com links simbólicos + OneDrive) |
| `next` | 16.3.6 | Framework | SSG/SSR por rota, Metadata API, `next/image`, `next/font`, roteamento por arquivo | Astro (ótimo para conteúdo, mas ecossistema React/Radix/Motion é mais maduro no Next) |
| `react` / `react-dom` | 19.3.0 | UI | Server Components, exigido pelo Next 16 | — |
| `typescript` | **6.0.3** | Linguagem | `strict`. **Não usar 7.x ainda**: `typescript-eslint` 8.71 aceita apenas `<6.1` (ADR-003) | TS 7 (compilador em Go, mais rápido) — reavaliar quando o lint suportar |
| `tailwindcss` + `@tailwindcss/postcss` | 4.3.3 | Estilos | Tokens via `@theme` no CSS, sem arquivo de config JS | CSS Modules (mais verboso para design system) |

### 2.2 UI

| Pacote | Versão | Uso | Justificativa | Alternativa |
|---|---|---|---|---|
| `radix-ui` | 1.6.7 | Primitivos acessíveis (Dialog, Popover, Tabs, Select, Tooltip, Accordion, Checkbox) | Pacote unificado, sem estilo próprio, foco/teclado/ARIA prontos | Pacotes `@radix-ui/react-*` separados (mesma coisa, mais linhas no package.json); shadcn/ui CLI (gera código com visual padrão que teríamos que desfazer — ADR-005) |
| `class-variance-authority` | 0.7.1 | Variantes de componentes | Padroniza `variant`/`size` sem repetir classes | Funções manuais |
| `clsx` | 2.1.1 | Classes condicionais | Minúsculo, padrão de mercado | — |
| `tailwind-merge` | 3.7.0 | Resolver conflitos de classes Tailwind | Permite `className` externo sobrescrever variantes | — |
| `@phosphor-icons/react` | 2.1.10 | Ícones | Família consistente, pesos (usar `light`/`regular`), import por ícone, entrypoint `/dist/ssr` para Server Components (ADR-006) | `lucide-react` (permitido pelo CLAUDE.md, mas visual muito associado a templates) |
| `next/font` | (Next) | Fontes self-hosted | Sem CLS, sem requisição a terceiros | `<link>` Google Fonts (proibido: privacidade + performance) |

### 2.3 Dados, validação e estado

| Pacote | Versão | Uso | Justificativa |
|---|---|---|---|
| `zod` | 4.6.5 | Schemas das entidades, searchParams, favoritos | Tipos derivados com `z.infer`; valida dados no build e no CI |
| `server-only` | 0.0.1 | Marcar `services/` como exclusivo do servidor | Garante que o catálogo inteiro nunca vá para o bundle do cliente (testado: import num Client Component derruba o build) |
| `zustand` | 5.0.15 | Favoritos com `persist` | Leve, sem provider, API simples para iniciante |
| `nuqs` | 2.10.1 | Estado de filtros/busca na URL | Tipado, compatível com App Router, evita bugs de sincronização |
| TanStack Query | — | **Não usar** enquanto os dados forem locais | Regra do CLAUDE.md 5.3 |

### 2.4 Busca

| Pacote | Versão | Uso | Justificativa |
|---|---|---|---|
| ~~`fuse.js`~~ | — | Removido na F3-04 | Procurava trechos dentro das palavras e trazia resultados sem relação. Substituído por busca própria palavra por palavra em `src/lib/search/search.ts`, sem dependência (ADR-026) |

### 2.5 Animação, 3D e mapas (instalar só na fase correspondente)

| Pacote | Versão | Fase | Justificativa |
|---|---|---|---|
| `motion` | 13.4.4 | 7 (uso pontual antes, se necessário) | Biblioteca **única** de animação JS (ADR-007). GSAP e Lenis **não** serão usados |
| `three` · `@react-three/fiber` · `@react-three/drei` | 0.186.1 · 9.8.1 · 10.7.9 | 8 | Padrão do ecossistema React para 3D; R3F 9.8 suporta React `>=19 <19.4` ✔ |
| `maplibre-gl` | 6.11.2 | 9 | Mapas vetoriais open source, sem chave obrigatória (provedor de tiles a decidir — ADR-015) |

### 2.6 Qualidade (dev)

| Pacote | Versão | Uso |
|---|---|---|
| `eslint` + `eslint-config-next` | **9.39.5** + 16.3.6 | Lint (flat config). **`next lint` foi removido no Next 16** → usar `eslint` direto. ESLint 10 incompatível com os plugins do Next (ADR-022) |
| `prettier` + `prettier-plugin-tailwindcss` | 3.9.9 + 0.8.1 | Formatação e ordenação de classes |
| `husky` + `lint-staged` | 9.1.7 + 17.6.0 | Checagens antes do commit |
| `vitest` + `vite` + `@vitejs/plugin-react` + `jsdom` | 5.0.2 + 8.3.1 + 6.1.1 + 30.1.1 | Testes unitários e de componente. `vite` é peer dependency obrigatória do Vitest e do plugin React (este exige Vite 8) |
| `@testing-library/react` + `dom` + `jest-dom` + `user-event` | 16.3.3 + 10.4.2 + 7.0.1 + 14.6.7 | Testes de componente centrados no usuário. `@testing-library/dom` é peer dependency obrigatória das outras três |
| `@playwright/test` + `@axe-core/playwright` | 1.63.0 + 4.13.0 | E2E + acessibilidade automatizada |
| `@next/bundle-analyzer` | 16.3.6 | Tamanho dos bundles (fase 10) |
| `schema-dts` | 2.0.0 | Tipos para JSON-LD (fase 10) |
| `tsx` | 4.23.15 | Rodar scripts TypeScript (validação de dados: `npm run validate:data`) |

> **Regra**: nenhuma dependência entra sem linha nesta tabela (nome, versão, motivo, alternativa). Pedir confirmação ao usuário antes de instalar.

---

## 3. Diagrama de camadas

```
┌──────────────────────────────────────────────────────────────────────┐
│  Navegador                                                            │
│  ┌──────────────────────────┐   ┌──────────────────────────────────┐ │
│  │ HTML estático (SSG)       │   │ Ilhas "use client"               │ │
│  │ gerado no build           │   │ SearchCombobox · FilterPanel     │ │
│  │                           │   │ FavoriteButton · Motion · 3D     │ │
│  └──────────────────────────┘   └───────────────┬──────────────────┘ │
│                                                  │ fetch sob demanda  │
└──────────────────────────────────────────────────┼────────────────────┘
                                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Next.js (servidor / build)                                           │
│  app/ (rotas, layouts, metadata, sitemap, route handlers estáticos)   │
│        │                                                              │
│        ▼                                                              │
│  components/ (Server Components por padrão)                           │
│        │                                                              │
│        ▼                                                              │
│  services/  ← única porta de acesso aos dados  ("server-only")        │
│   getWineBySlug · listWines(filtros) · getRelatedWines · buildIndex…  │
│        │                                                              │
│        ▼                                                              │
│  adapters/ (fonte de dados atual)                                     │
│   localAdapter → src/data/*.ts   ···   futuro: apiAdapter / dbAdapter │
│        │                                                              │
│        ▼                                                              │
│  schemas/ (Zod) valida TUDO que entra  →  types/ (z.infer)            │
└──────────────────────────────────────────────────────────────────────┘
```

Regras de dependência entre pastas (quem pode importar quem):

| Camada | Pode importar | Não pode importar |
|---|---|---|
| `app/` | components, services, lib, config, schemas, types | data, adapters |
| `components/` | components, hooks, lib, stores, types, config | services (exceto via props), data |
| `services/` | adapters, schemas, lib, types | components, app |
| `adapters/` | data, schemas, types | services, components |
| `stores/`, `hooks/` | lib, schemas, types | services, data |

---

## 4. Estrutura de pastas

```
/
├─ CLAUDE.md  README.md                # ficam na raiz (Claude Code e GitHub os procuram lá)
├─ docs/                               # toda a documentação do projeto
│  ├─ PRD.md  ARCHITECTURE.md  DESIGN.md  RULES.md  TASKS.md  MEMORY.md
│  ├─ DECISIONS.md  DATA_MODEL.md  DATA_SOURCES.md  IMAGES.md  SEO.md
│  └─ SECURITY.md  ACCESSIBILITY.md  PERFORMANCE.md  ANIMATIONS.md  TESTING.md  CHANGELOG.md
├─ .env.example  .gitignore  .gitattributes  .editorconfig  .prettierrc  eslint.config.mjs  .node-version
├─ public/
│  ├─ images/{wines,grapes,regions,producers,ambient}/   # fotos licenciadas (ver IMAGES.md)
│  ├─ geo/                                               # GeoJSON com fonte (fase 9)
│  ├─ models/                                            # GLB otimizados (fase 8)
│  └─ favicon/ …
├─ scripts/
│  ├─ validate-data.ts          # valida schemas, fontes, imagens, relações (roda no CI)
│  └─ optimize-image.ts         # (opcional) padroniza imagens de origem
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx  globals (via styles/)  not-found.tsx  error.tsx  global-error.tsx
│  │  ├─ (site)/page.tsx                   # Home
│  │  ├─ (site)/sobre/page.tsx
│  │  ├─ (site)/explorar/page.tsx
│  │  ├─ pesquisa/page.tsx                 # resultados de busca (?q=)
│  │  ├─ vinhos/page.tsx  vinhos/[slug]/page.tsx
│  │  ├─ uvas/…  regioes/…  paises/…  produtores/…  vinicolas/…
│  │  ├─ harmonizacoes/page.tsx  harmonizacoes/[slug]/page.tsx
│  │  ├─ favoritos/page.tsx
│  │  ├─ api/search-index/route.ts         # JSON estático do índice de busca
│  │  ├─ sitemap.ts  robots.ts  opengraph-image.tsx  manifest.ts
│  ├─ components/
│  │  ├─ ui/          # Button, IconButton, Input, Select, Checkbox, Chip, Badge, Card,
│  │  │               # Dialog, Sheet, Tabs, Accordion, Tooltip, Skeleton, Breadcrumbs…
│  │  ├─ layout/      # SiteHeader, SiteFooter, BottomNav, SkipLink, PageHeader, Section
│  │  ├─ states/      # EmptyState, ErrorState, NoResults, IncompleteDataNote, DemoBadge
│  │  ├─ media/       # EntityImage, ImageUnavailable, ImageCredit
│  │  ├─ sources/     # SourceList, SourceBadge
│  │  ├─ wine/  grape/  region/  producer/  pairing/
│  │  ├─ search/      # SearchCombobox, SearchResults, SearchShortcut
│  │  ├─ filters/     # FilterPanel, FilterGroup, ActiveFilters, SortSelect
│  │  ├─ favorites/   # FavoriteButton, FavoritesList
│  │  ├─ three/       # (fase 8) cenas carregadas sob demanda
│  │  ├─ maps/        # (fase 9) RegionMap carregado sob demanda
│  │  └─ motion/      # Reveal, MotionProvider (fase 7)
│  ├─ adapters/       # local.ts (lê src/data), futuro api.ts
│  ├─ data/           # wines.ts, producers.ts, grapes.ts, regions.ts, countries.ts,
│  │                  # sources.ts, images.ts, pairings.ts, styles.ts  (+ demo/ separado)
│  ├─ services/       # wines.ts, grapes.ts, regions.ts, search.ts, related.ts, facets.ts
│  ├─ schemas/        # Zod por entidade + filters.ts + favorites.ts
│  ├─ types/          # tipos derivados e utilitários (Sourced<T> etc.)
│  ├─ hooks/          # useHasHydrated, useSearchShortcut, useMediaQuery
│  ├─ stores/         # favorites.ts (Zustand persist)
│  ├─ lib/            # cn.ts, normalize.ts, slug.ts, format.ts, seo.ts, json-ld.ts
│  ├─ styles/         # globals.css (tokens @theme, base, utilitários)
│  └─ config/         # site.ts, nav.ts, constants.ts (z-index, limites), flags.ts
├─ tests/
│  ├─ unit/  component/  e2e/
└─ .github/workflows/ci.yml
```

**Observação sobre o scaffold:** `create-next-app` se recusa a rodar em pasta com arquivos que possam conflitar (os `.md` desta fase). Na Fase 1 o projeto será montado **manualmente** (`npm init` + instalação explícita de cada pacote), o que também é mais didático.

---

## 5. Fluxo de dados

1. **Curadoria** (humana, com apoio de IA para pesquisa): dados entram em `src/data/*.ts` com `sourceIds` e `ImageAsset` completos.
2. **Validação**: `npm run validate:data` (Zod + regras de integridade) roda localmente e no CI; build falha se houver dado inválido.
3. **Adapter** lê e entrega objetos validados.
4. **Services** montam consultas (por slug, filtros, relações, facetas) e retornam tipos de domínio.
5. **Páginas** (Server Components) chamam services no build → HTML estático.
6. **Cliente** recebe apenas o necessário via props (ex.: `{id, type, slug}` para o botão de favorito).
7. **Busca**: índice enxuto (`id, type, slug, título, subtítulo, termos normalizados`) é servido em `/api/search-index` (estático) e baixado **só quando** o usuário foca a busca.

---

## 6. Estratégia de renderização por rota

| Rota | Estratégia | Detalhes |
|---|---|---|
| `/` | SSG | Destaques calculados no build |
| `/vinhos/[slug]`, `/uvas/[slug]`, `/regioes/[slug]`, `/paises/[slug]`, `/produtores/[slug]`, `/vinicolas/[slug]`, `/harmonizacoes/[slug]` | SSG (`generateStaticParams`, `dynamicParams = false`) | Slug inexistente → 404 |
| `/uvas`, `/regioes`, `/paises`, `/produtores`, `/vinicolas`, `/harmonizacoes` | SSG | Listas pequenas |
| `/vinhos` (com filtros) | **Dinâmica** (lê `searchParams`) | Filtragem no servidor → funciona sem JS, URL compartilhável. Página sem parâmetros é a canônica |
| `/pesquisa?q=` | Dinâmica | Resultado completo da busca renderizado no servidor; autocomplete é client-side |
| `/favoritos` | SSG da casca + cliente | Conteúdo depende do `localStorage` → renderizado no cliente com skeleton |
| `/api/search-index` | Estático (`dynamic = 'force-static'`) | Gerado no build, cacheável |
| `/sobre`, `/explorar` | SSG | |
| `sitemap.xml`, `robots.txt` | Estático | |

**ISR** não é necessário enquanto os dados forem locais (cada mudança de dados = novo deploy). Quando houver API/banco, usar `revalidate` por tag.

Next 16: `params` e `searchParams` são **assíncronos** (`await params`). Turbopack é o bundler padrão. `cacheComponents` não será ativado no início (simplicidade); reavaliar na fase 10.

---

## 7. Camada de dados (mock → real)

- **Agora**: `src/data/*.ts` exportam arrays tipados e validados. Dados demo ficam em `src/data/demo/` e só são carregados quando `NEXT_PUBLIC_ENABLE_DEMO_DATA=true` (nunca em produção).
- **Interface do adapter** (`src/adapters/types.ts`): `getAll(entity)`, `getById(entity, id)`. Services dependem só dessa interface.
- **Futuro**: `dbAdapter` (PostgreSQL via Supabase ou Neon + Drizzle) ou `apiAdapter`. Trocar o adapter não muda nenhuma página.
- Modelo completo em `DATA_MODEL.md`; fontes em `DATA_SOURCES.md`.

---

## 8. Estratégia de busca

- **Normalização** (`lib/normalize.ts`): minúsculas, remoção de acentos (`NFD` + remoção de diacríticos), remoção de pontuação, espaços colapsados. Aplicada no índice e na consulta.
- **Algoritmo** (`lib/search/search.ts`, ADR-026): cada termo é comparado com cada **palavra** do documento: igual, começo da palavra ou grafia parecida (distância de edição com inversão; 0 erro até 3 letras, 1 de 4 a 7, 2 a partir de 8). Penalidade por campo: nome 0 · palavras extras 0,2 · subtítulo 0,25; entre nomes, vence o mais coberto pela consulta; empate em ordem alfabética.
- **Autocomplete (cliente)**: buscador e índice carregados no primeiro foco; índice baixado uma vez e memorizado. Resultados agrupados por tipo (máx. 5 por grupo). Debounce 120 ms.
- **Consulta** (`lib/search/search.ts`, F3-01): cada palavra da consulta precisa casar com alguma palavra de algum campo (nome, palavras extras ou subtítulo), então "tinto frances" traz só tintos franceses. Palavras de uma letra e palavras genéricas ("vinho", "uva", "de", "do"…) são ignoradas, a menos que a consulta só tenha elas. Consulta limitada a 100 caracteres e 8 palavras.
- **Índice** (`lib/search/documents.ts` + `services/search.ts`, F3-02): um documento por vinho, uva, região, país e produtor publicados, com `id` `{tipo}:{id}`, nome, subtítulo de contexto, palavras extras e `href`. Palavras extras saem só dos dados já cadastrados (tipo, categoria do espumante, uvas do rótulo e das safras, sinônimos do VIVC, país) mais os gentílicos dos 6 países (`lib/search/demonyms.ts`, palavras do português, não dados de vinho). Com o catálogo inicial: 46 documentos, cerca de 9 KB.
- **Resultados (servidor)**: `/pesquisa?q=` usa o mesmo algoritmo no servidor, com lista completa paginada (20 por página, `?pagina=`) e filtro por tipo (`?tipo=vinhos|uvas|regioes|paises|produtores`), só com os tipos que têm resultados.
- **Acessibilidade**: padrão WAI-ARIA combobox (ver `ACCESSIBILITY.md`).
- **Limite**: a busca percorre todos os documentos; adequada até ~5–10 mil documentos / índice ≤ ~500 KB gzip. Acima disso → migrar para Orama/MiniSearch (índice pré-computado) ou Meilisearch/Typesense (serviço). Monitorar tamanho do índice no CI.

## 9. Estratégia de filtros

- Schema Zod `schemas/filters.ts` valida `searchParams` (valores desconhecidos são ignorados, não quebram).
- Filtragem e **facetas** (contagem por opção) calculadas em `services/facets.ts` sobre os dados reais → só aparecem opções existentes.
- No cliente, `nuqs` sincroniza os controles com a URL (`shallow: false` para o servidor re-renderizar).
- Combinação: **E** entre grupos, **OU** dentro do mesmo grupo (ex.: País = Itália OU França, E Tipo = Tinto).
- "Feito principalmente com a uva X" = uva com maior percentual **confirmado** ou marcada como principal na fonte; sem dado confirmado, o vinho entra apenas no filtro "contém a uva X".

## 10. Estratégia de cache

| Recurso | Cache |
|---|---|
| Páginas SSG e `/api/search-index` | CDN da Vercel, invalidado a cada deploy |
| Assets com hash (`/_next/static`) | `immutable`, 1 ano (padrão do Next) |
| Imagens otimizadas (`next/image`) | Cache do otimizador; `minimumCacheTTL` alto (imagens raramente mudam) |
| Fontes | Self-hosted via `next/font`, cache longo |
| Páginas dinâmicas (`/vinhos?…`, `/pesquisa`) | Sem cache compartilhado inicialmente; reavaliar `Cache-Control` na fase 10 |

## 11. Estratégia de imagens (resumo — detalhes em `IMAGES.md`)

- Arquivos licenciados copiados para `public/images/...` (não depender de hotlink), metadados em `src/data/images.ts` (`ImageAsset`).
- `next/image` com `sizes` corretos, AVIF/WebP, `priority` apenas na imagem LCP, `placeholder="blur"` quando houver `blurDataURL`.
- Componente `EntityImage` resolve a imagem da entidade; se não houver → `ImageUnavailable` com a mesma proporção (sem CLS).
- `remotePatterns` restrito; nenhuma origem remota na v1 (tudo local).

## 12. Estratégia de animação e 3D (resumo — detalhes em `ANIMATIONS.md` e `PERFORMANCE.md`)

- CSS transitions para microinterações; **Motion** apenas onde CSS não basta (layout, presença, sequência).
- Componentes de animação são **folhas client** isoladas; conteúdo continua renderizado no servidor.
- `prefers-reduced-motion` → sem movimento, conteúdo completo.
- 3D (fase 8): `next/dynamic` com `ssr: false`, montado por `IntersectionObserver` fora do LCP, `frameloop="demand"`, DPR ≤ 1,5, pausa fora da viewport, fallback de imagem real estática em mobile/dispositivo fraco/movimento reduzido.

## 13. Deploy

- **Vercel** (quando o usuário pedir). Build: `npm run build`. Node 24.
- **GitHub Actions** (`.github/workflows/ci.yml`): `npm ci` → `lint` → `typecheck` → `validate:data` → `test` → `build` → (fase 10) `test:e2e` + Lighthouse CI.
- Branch `main` protegida; trabalho em branches `feat/...` com PR.

## 14. Variáveis de ambiente

Ver `.env.example`. Na v1 **não há segredos**.

| Variável | Pública? | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sim | URLs absolutas (canonical, OG, sitemap) |
| `NEXT_PUBLIC_ENABLE_DEMO_DATA` | Sim | Carregar dados demo (só desenvolvimento) |
| `NEXT_PUBLIC_MAP_STYLE_URL` | Sim | Estilo de mapa (fase 9) |
| `MAP_TILES_API_KEY` | **Não** | Somente se o provedor exigir chave privada (fase 9) |

## 15. Skills, MCPs e ferramentas do ambiente

Levantamento feito em 2026-09-28:

| Recurso | Uso previsto |
|---|---|
| Skill `design-taste-frontend` | Consultada na Fase 0: regras anti-"visual genérico de IA" incorporadas ao `DESIGN.md` (acento único, sistema de raios único, evitar Inter/Fraunces, estados completos, movimento motivado, modo escuro por tokens) |
| Skill `impeccable` / `emil-design-eng` | Revisão de polimento de componentes e animações (fases 1, 7) |
| Skills `design:accessibility-review`, `design:ux-copy`, `design:design-system` | Auditorias de a11y, textos de interface e consistência do design system |
| Skill `engineering:testing-strategy`, `engineering:code-review`, `security-review` | Revisões por fase |
| MCP **Vercel** | Deploy e logs — **somente quando o usuário pedir** |
| MCP Canva / Figma | Figma exige autenticação (não conectado). Não necessários para a v1 |
| Busca web (WebSearch/WebFetch) | Pesquisa e verificação de dados reais e licenças de imagem (Fase 2) |

Pastas de referências visuais (`/design`, `/references`, `/docs/design`, `/assets/references`) **não existem** no projeto → pergunta ao usuário registrada em `PRD.md` §13.

---

## 16. Riscos técnicos e mitigação

| # | Risco | Prob. | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | **Obter dados reais verificados** com licença adequada | Alta | Crítico | Começar pequeno (catálogo curado); hierarquia de fontes (`DATA_SOURCES.md`); validação automática; campos ausentes em vez de inventados |
| R2 | **Direitos de imagem** — muitos vinhos sem foto licenciada | Alta | Alto | `ImageUnavailable` elegante; Wikimedia Commons; pedir autorização a produtores (modelo de e-mail em `IMAGES.md`) |
| R3 | Direitos autorais de texto | Média | Alto | Texto sempre próprio + citação da fonte; revisão no checklist |
| R4 | Performance do 3D em aparelhos fracos | Média | Médio | Sob demanda, fallback estático, orçamento em `PERFORMANCE.md` |
| R5 | Índice de busca crescer demais | Baixa (v1) | Médio | Monitorar tamanho no CI; plano de migração (§8) |
| R6 | SEO com muitas páginas geradas | Baixa (v1) | Médio | SSG, sitemap com `generateSitemaps` acima de 50 mil URLs, canonical em páginas filtradas |
| R7 | Mapas: licença de tiles e peso da lib | Média | Médio | MapLibre carregado sob demanda; provedor com licença clara; atribuição obrigatória (ADR-015) |
| R8 | Conteúdo sobre álcool (idade, publicidade) | Média | Alto | Aviso de consumo responsável; decisão de verificação de idade (ADR-012); sem linguagem publicitária |
| R9 | Complexidade para iniciante | Alta | Médio | Stack enxuta, fases pequenas, explicação de cada comando, docs sempre atualizados |
| R10 | Sobreposição de libs de animação | Baixa | Baixo | Motion é a única (ADR-007) |
| R11 | **Projeto dentro do OneDrive**: sincronização de `node_modules`/`.next`/`.git` causa lentidão, travamento de arquivos e erros `EPERM`/`EBUSY` no Windows | Alta | Médio | Recomendado mover para `C:\dev\Projeto-Vinhos` antes da Fase 1 (ADR-016) |
| R12 | Versões muito novas (TS 7, ESLint 10) com incompatibilidades | Média | Médio | Versões fixadas; TS 6.0.3; checar peer deps antes de atualizar |
| R13 | Hidratação de favoritos (servidor não conhece o `localStorage`) | Média | Baixo | `skipHydration` + `useHasHydrated`; skeleton até hidratar |
| R14 | CSP estrita x scripts inline do Next em páginas estáticas | Média | Médio | CSP via headers sem nonce na v1 (ver `SECURITY.md`); avaliar SRI/hashes na fase 10 |
