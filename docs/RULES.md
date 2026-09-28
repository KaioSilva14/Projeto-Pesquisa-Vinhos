# RULES — Regras de código e de conteúdo

> Versão 0.1 · Fase 0 · 2026-09-28
> Estas regras valem para humanos e para IA. Em conflito: `CLAUDE.md` §2 (regras inegociáveis) vence.

---

## 1. Regras de conteúdo

### 1.1 Veracidade (inegociável)
1. **Nada inventado.** Nenhum nome, safra, teor alcoólico, percentual de uva, prêmio, nota, preço, potencial de guarda ou história sem fonte registrada.
2. Toda afirmação factual sobre entidade real usa `Sourced<T>` com ao menos um `sourceId` válido.
3. Sem fonte → **campo ausente**. Nunca `0`, `"N/A"`, `"Desconhecido"` preenchido como dado, nem valor padrão.
4. Divergência entre fontes → usar a de maior hierarquia (`DATA_SOURCES.md`) e registrar a divergência em `notes` do dado.
5. Dados de demonstração: `isDemo: true`, nomes claramente fictícios ("Vinho Exemplo 01 (demonstração)"), selo visível, carregados apenas com `NEXT_PUBLIC_ENABLE_DEMO_DATA=true`. **Nunca** nome real com dado fabricado.
6. IA pode ajudar a **pesquisar e resumir**, mas cada dado é conferido na fonte original antes de entrar em `src/data/`.

### 1.2 Texto
1. Texto **sempre próprio**, reescrito com palavras nossas, citando a fonte. Proibido copiar descrições de produtores, sites ou livros (nem "levemente adaptado").
2. Harmonizações e perfis são apresentados como **orientação** ("costuma combinar com…", "o produtor sugere…"), nunca como regra absoluta.
3. Linguagem sóbria e informativa sobre álcool. Proibido: incentivo ao consumo, humor sobre embriaguez, apelo a menores, associação a desempenho/sucesso.
4. Português do Brasil, frases diretas. Termos técnicos explicados na primeira ocorrência (ou com link para o glossário).
5. Textos da interface: sem travessão (—), sem clichês ("eleve", "desbloqueie", "experiência única", "jornada sensorial"), sem exclamações em excesso.

### 1.3 Imagens
1. Só fotografias reais, licenciadas e **correspondentes** à entidade (política completa em `IMAGES.md`).
2. Todo `ImageAsset` tem `alt`, `credit`, `license`, `sourceUrl`, `subjectType` e, quando específico, `subjectId`.
3. Proibido desenhar garrafas, vinhedos, vinícolas, pessoas ou mapas com HTML/CSS/SVG.
4. Sem imagem confiável → `ImageUnavailable`.

---

## 2. Regras de código

### 2.1 TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`, `exactOptionalPropertyTypes: true`.
- `any` proibido. Se inevitável: `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- motivo` com justificativa.
- Preferir `unknown` + validação Zod para dados externos.
- Tipos de entidades **derivados dos schemas Zod** (`z.infer`) — uma única fonte da verdade.
- Sem `as` para "forçar" tipos, exceto `as const` e casos justificados em comentário.
- Sem non-null assertion (`!`) sem justificativa.

### 2.2 React / Next.js
- **Server Components por padrão.** `"use client"` só em componentes com estado, eventos, efeitos, APIs do navegador ou animação — e o mais "folha" possível.
- Nunca importar `services/` ou `data/` em componente client.
- `services/` começam com `import "server-only"`.
- Dados passados ao cliente: o mínimo (ids, slugs, rótulos).
- `params`/`searchParams` sempre com `await` e validados (Zod).
- Sem `useEffect` para buscar dados que podem vir do servidor.
- Sem `window.addEventListener("scroll", …)`; usar `IntersectionObserver`, CSS scroll-driven ou hooks do Motion.
- Toda rota de entidade exporta `generateMetadata` e `generateStaticParams`.
- `key` estável (id), nunca índice em listas que mudam.

### 2.3 Estilo
- Apenas classes Tailwind com tokens do `DESIGN.md`. Proibido valor arbitrário de cor (`bg-[#123456]`).
- Valores arbitrários de tamanho só com justificativa (ex.: proporção de imagem).
- Variantes com CVA; mescla com `cn()`.
- Sem CSS inline (`style={{}}`) exceto valores dinâmicos (ex.: ponto focal).

### 2.4 Convenções de nome

| Item | Convenção | Exemplo |
|---|---|---|
| Componente React (arquivo e nome) | PascalCase | `WineCard.tsx` → `export function WineCard` |
| Hook | camelCase com `use` | `useHasHydrated.ts` |
| Demais arquivos TS | kebab-case | `search-index.ts`, `normalize.ts` |
| Pastas | kebab-case | `components/wine/` |
| Rotas | português, kebab-case | `app/regioes/[slug]` |
| Tipos/interfaces | PascalCase | `Wine`, `ImageAsset` |
| Schemas Zod | camelCase + `Schema` | `wineSchema` |
| Constantes globais | UPPER_SNAKE_CASE | `MAX_AUTOCOMPLETE_RESULTS` |
| ids de dados | kebab-case, estáveis, sem acento | `malbec` |
| Código (variáveis, funções) | **inglês** | `getWineBySlug` |
| Textos de interface e dados | **português** | "Imagem indisponível" |

- **Exports nomeados** em tudo, exceto arquivos especiais do Next (`page`, `layout`, `error`…), que exigem `default`.
- Imports absolutos com alias `@/` (`@/components/ui/Button`).

### 2.5 Limites de tamanho (referências, não dogmas)

| Item | Limite | Ação se passar |
|---|---|---|
| Componente | ~200 linhas | Dividir em subcomponentes |
| Arquivo qualquer | ~300 linhas (exceto arquivos de dados) | Dividir por responsabilidade |
| Função | ~40 linhas | Extrair funções |
| Props de componente | ~8 | Agrupar ou dividir componente |
| Profundidade de JSX | ~5 níveis | Extrair componente |

### 2.6 Comentários
- Comentar o **porquê**, não o **o quê**. Comentários didáticos são bem-vindos quando ensinam algo não óbvio (usuário está aprendendo).
- Sem código comentado "morto". Sem `TODO` sem ID de tarefa (`// TODO(F3-04): …`).

### 2.7 Erros e estados
- Toda busca de dados com caminho de erro tratado.
- Toda lista com estado vazio; todo campo opcional com renderização condicional.
- `error.tsx` e `not-found.tsx` na raiz e onde fizer sentido.
- `localStorage` sempre em `try/catch`.

---

## 3. Dependências

1. Toda dependência nova exige: **pedido de confirmação ao usuário** + linha em `ARCHITECTURE.md` §2 (nome, versão, motivo, alternativa) + ADR se for estrutural.
2. Preferir: API nativa > Next/React > dependência pequena e mantida > dependência grande.
3. Verificar antes de instalar: manutenção ativa (commit/release recente), licença compatível (MIT/Apache/BSD/ISC/OFL), peso (bundlephobia/pkg-size), peer dependencies compatíveis.
4. Proibido sem ADR: Material UI, Ant Design, Chakra, Redux, jQuery, moment.js, lodash inteiro, múltiplas libs de animação, SDKs de pagamento, scrapers.
5. `npm audit` no CI; vulnerabilidade alta/crítica bloqueia o merge.
6. Versões fixadas (`--save-exact`) para framework e libs de build.

---

## 4. Git e commits

- **Conventional Commits**, descrição em português, imperativo, minúsculas:
  `feat(busca): adiciona autocomplete agrupado por tipo`
  Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `data` (inclusão/correção de dados verificados).
  Escopos sugeridos: `busca`, `filtros`, `vinho`, `uva`, `regiao`, `produtor`, `favoritos`, `ui`, `layout`, `dados`, `seo`, `a11y`, `deps`.
- Commits pequenos (uma ideia por commit). Nunca commitar `.env*` (exceto `.env.example`), `node_modules`, `.next`.
- Branches: `main` (estável) + `feat/…`, `fix/…`, `docs/…`, `data/…`.
- Commits de dados (`data:`) citam no corpo as fontes consultadas.
- Hooks (Husky) nunca são pulados (`--no-verify` proibido).

---

## 5. Proibido (resumo)

- Inventar dados · copiar textos · imagens sem licença ou sem correspondência.
- E-commerce em qualquer forma (preço, carrinho, "comprar", afiliados).
- Avaliações/notas fictícias.
- Desenhar garrafas/vinhedos/mapas em HTML/CSS/SVG.
- `any` sem justificativa · segredos no código · `dangerouslySetInnerHTML` com conteúdo não sanitizado.
- Scraping que viole termos de uso ou `robots.txt`.
- Animação que ignore `prefers-reduced-motion`.
- Dependência sem justificativa.

---

## 6. Checklist de revisão (todo PR/tarefa)

**Conteúdo**
- [ ] Nenhuma informação inventada; todo dado novo tem `sourceIds` válidos.
- [ ] Textos próprios, sem cópia; tom informativo e responsável.
- [ ] Imagens com `alt`, crédito, licença, origem e correspondência.

**Código**
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run validate:data`, `npm run build` passando.
- [ ] Sem `any`/`!`/`as` injustificados.
- [ ] Server Component por padrão; `"use client"` justificado.
- [ ] Limites de tamanho respeitados.
- [ ] Sem dependência nova não aprovada.

**Experiência**
- [ ] Estados: loading, vazio, erro, sem resultados, dados incompletos, sem imagem.
- [ ] Testado em 360, 768 e 1440 px.
- [ ] Navegável por teclado, foco visível, contraste AA, movimento reduzido.
- [ ] Metadata/SEO da página (se for rota).

**Docs**
- [ ] `TASKS.md` e `MEMORY.md` atualizados; `DECISIONS.md` se houve decisão; `CHANGELOG.md` se mudou versão.
