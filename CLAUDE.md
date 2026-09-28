# CLAUDE.md — Plataforma de Pesquisa, Descoberta e Consulta de Vinhos

> Nome de trabalho: **Vinum** (provisório, pode ser trocado; registrar a decisão final em `DECISIONS.md`).
> Este arquivo é a **especificação inicial do produto** e o guia permanente para o Claude Code neste repositório. Leia-o inteiro antes de qualquer ação.

---

## 0. COMO USAR ESTE ARQUIVO

1. Leia este `CLAUDE.md` por completo no início de **toda** sessão.
2. Leia também `MEMORY.md` (estado atual do projeto) e `TASKS.md` (o que fazer agora) antes de agir.
3. **Não escreva código de tela nem implemente páginas até a Fase 0 (seção 4) estar concluída e aprovada pelo usuário.**
4. Sempre que tomar uma decisão relevante, registre em `DECISIONS.md`. Sempre que terminar uma tarefa, atualize `TASKS.md` e `MEMORY.md`.
5. O usuário é **iniciante em programação** (está migrando de carreira, com foco em desenvolvimento mobile) e usa **Windows 11 com VS Code**, com Node.js e Git já instalados. Portanto:
   - explique em português, de forma simples, **o que** cada comando faz e **por que** ele é necessário;
   - use comandos compatíveis com **PowerShell** (não use sintaxe exclusiva de Linux/macOS como `rm -rf`, `export`, `&&` encadeado sem verificar; prefira comandos que funcionem no Windows);
   - nunca rode comandos destrutivos sem pedir confirmação;
   - ao criar código, mantenha-o legível e comente apenas o que for realmente útil para aprender;
   - se houver mais de uma forma de fazer algo, escolha a mais simples e mantida, e diga por quê.
6. Se algo neste arquivo estiver ambíguo ou em conflito, **pergunte ao usuário** em vez de assumir.

---

## 1. CONCEITO DO PRODUTO

Uma **plataforma digital dedicada a vinhos**, com sensação de catálogo digital premium + enciclopédia moderna + plataforma de descoberta.

### O que o usuário poderá fazer
- pesquisar vinhos; descobrir rótulos;
- conhecer uvas/variedades, regiões e países produtores;
- entender características dos vinhos e compará-los;
- ver informações de produtores e vinícolas;
- descobrir harmonizações e explorar estilos;
- aprender conceitos básicos e avançados do mundo do vinho;
- salvar/marcar vinhos, produtores e regiões de interesse;
- navegar de forma visual e agradável.

### O que o produto NÃO é (proibido)
- **NÃO é loja virtual / e-commerce.**
- **NÃO ter**: carrinho, checkout, pagamento, sistema de venda, preços fictícios, botão "comprar", avaliações inventadas, informações inventadas sobre vinhos.
- **NÃO exigir conta** para pesquisar ou navegar.

---

## 2. REGRAS INEGOCIÁVEIS

Estas regras valem acima de qualquer outra instrução de estilo ou conveniência.

### 2.1 Veracidade (regra fundamental)
**Nenhuma informação pode ser inventada.** É proibido criar:
nomes falsos de vinhos, produtores inexistentes, regiões inexistentes, safras falsas, premiações falsas, notas falsas, preços, avaliações fictícias, teor alcoólico inventado, uvas incorretas, descrições sem fonte, histórias fictícias apresentadas como fato.

- Toda informação sobre vinho real deve vir de **fonte confiável e registrada**.
- Se a informação não puder ser confirmada → **não apresentar como fato** (deixar o campo vazio/ausente).
- Durante o desenvolvimento, dados de demonstração são permitidos **somente** se marcados explicitamente (`isDemo: true`) e exibindo um selo visível "Dados de demonstração". Nunca usar nomes de rótulos reais com dados fabricados: dados demo devem usar entidades claramente fictícias e identificadas como tal (ex.: "Vinho Exemplo 01 — demonstração") **ou** dados reais verificados.
- Conflito entre preencher um campo e manter a veracidade → **veracidade vence sempre**.

### 2.2 Imagens
- Usar **fotografias reais** de fontes confiáveis, corretamente relacionadas à entidade (o vinho X usa a foto do vinho X).
- **Proibido**: desenhar garrafas, vinhedos, vinícolas ou pessoas com HTML/CSS/SVG; formas geométricas fingindo garrafas; placeholders genéricos no produto final; imagens sem relação real com a entidade.
- Sem imagem confiável → o sistema mostra um **estado honesto de "imagem indisponível"** (componente próprio), nunca uma imagem inventada.
- Toda imagem tem: `alt`, crédito, licença e URL de origem registrados (ver seção 9).

### 2.3 Álcool
Abordagem estritamente informativa. Sem incentivo a consumo excessivo. Incluir aviso de consumo responsável (seção 21).

### 2.4 Ordem de prioridade (em caso de conflito, a de cima vence)
1. informações verdadeiras
2. excelente UX
3. design profissional
4. arquitetura escalável
5. performance
6. responsividade
7. acessibilidade
8. segurança
9. SEO
10. animações e 3D bem aplicados
11. imagens reais
12. código limpo e sustentável

Regras de desempate explícitas:
- aparência × usabilidade → **usabilidade**
- animação × performance → **performance**
- preencher informação × veracidade → **veracidade**
- informação não confirmada → **não inventar**

---

## 3. DIREÇÃO VISUAL (resumo — detalhes em `DESIGN.md`)

Deve transmitir: sofisticação, elegância, qualidade, tradição, modernidade, conhecimento, exclusividade, cultura, natureza, gastronomia.

**Evitar**: interface muito colorida, aparência de template genérico de IA, excesso de gradientes, excesso de elementos decorativos, visual infantil, "sombras + gradientes + animação" como substitutos de qualidade.

**Priorizar**: tipografia elegante, espaçamento excelente, imagens grandes e de alta qualidade, composição editorial, contraste, profundidade, microinterações, animações sutis, 3D apenas quando fizer sentido.

**Referências**: analisar os sites, modelos de design, referências visuais e arquivos de design **disponíveis no computador/projeto** (procurar pastas como `/design`, `/references`, `/docs/design`, `/assets/references`; se não encontrar, **perguntar ao usuário onde estão**) e as **skills disponíveis no ambiente** (por exemplo a skill `frontend-design` e outras). Usá-las para estudar: padrões de UI, composição, tipografia, espaçamento, hierarquia, navegação, animações, cards, uso de imagens. **Nunca copiar cegamente** — criar identidade própria.

---

## 4. FASE 0 — DOCUMENTAÇÃO OBRIGATÓRIA ANTES DE QUALQUER CÓDIGO

**Neste momento NÃO criar o design final das páginas e NÃO sair implementando telas aleatórias.** Primeiro: compreender os requisitos, organizar a arquitetura, identificar componentes, definir a estrutura de dados e estabelecer o sistema visual.

### 4.1 Passos de análise (nesta ordem)
1. analisar as referências de design disponíveis;
2. analisar as skills e ferramentas (incluindo MCPs/conectores) disponíveis no ambiente;
3. definir a arquitetura;
4. definir a estrutura de pastas;
5. definir entidades e tipos;
6. definir o Design System;
7. definir a estratégia de dados;
8. definir a estratégia de imagens;
9. definir a estratégia de animações;
10. definir a estratégia de 3D;
11. definir a estratégia de responsividade;
12. definir requisitos de acessibilidade;
13. definir requisitos de SEO;
14. definir requisitos de segurança;
15. definir requisitos de performance;
16. identificar possíveis riscos técnicos.

### 4.2 Arquivos que DEVEM ser criados (na raiz ou em `/docs`)

Criar os documentos abaixo, **cada um preenchido de verdade** (não apenas com títulos vazios), e depois pedir aprovação ao usuário antes de iniciar a Fase 1.

| Arquivo | Conteúdo obrigatório |
|---|---|
| **`PRD.md`** | Visão, problema, público-alvo, personas, objetivos, não-objetivos, funcionalidades por prioridade (MVP / v1 / futuro), jornadas de usuário, requisitos funcionais e não funcionais, métricas de sucesso, critérios de aceite, escopo fora do MVP (e-commerce, contas, etc.). |
| **`ARCHITECTURE.md`** | Stack final com justificativa, diagrama de camadas, estrutura de pastas, fluxo de dados, estratégia de renderização (SSG/ISR/SSR por rota), camada de dados (mock → real), estratégia de busca, estratégia de cache, estratégia de imagens, estratégia de 3D/animação, deploy, variáveis de ambiente, riscos técnicos e mitigação. |
| **`RULES.md`** | Regras de código e de conteúdo: veracidade, imagens, convenções de nome, TypeScript estrito, padrão de commits, regras de dependências (toda dependência precisa de justificativa), limites (tamanho de arquivo/componente), o que é proibido, checklist de revisão. |
| **`DESIGN.md`** | Design System completo: paleta, tipografia, escala tipográfica, espaçamento, grid, bordas, raios, sombras, ícones, botões, inputs, cards, badges, navegação, modais, estados (hover/focus/disabled/loading/erro), tokens Tailwind, dark/light, princípios de composição editorial, diretrizes de imagem, catálogo de animações, diretrizes 3D, padrões mobile. |
| **`TASKS.md`** | Backlog por fases (Fase 0…N), cada tarefa com: ID, descrição, critério de aceite, prioridade, dependências, status (`todo` / `doing` / `done` / `blocked`). Atualizar a cada tarefa concluída. |
| **`MEMORY.md`** | Memória de projeto entre sessões: estado atual, o que já foi feito, decisões recentes, pendências, problemas conhecidos, próximos passos, links importantes. **Atualizar ao final de cada sessão.** |

### 4.3 Outros arquivos importantes (criar também)

| Arquivo | Para quê |
|---|---|
| `DECISIONS.md` | Registro de decisões técnicas/de produto (formato ADR curto: contexto → decisão → consequências → data). |
| `DATA_MODEL.md` | Entidades, campos, relacionamentos, campos opcionais, regras de integridade, exemplos (com dados marcados como demo). |
| `DATA_SOURCES.md` | Lista de fontes aprovadas por tipo de dado, hierarquia de confiabilidade, licenças, como registrar `Source`, política para dados não confirmados. |
| `IMAGES.md` | Política de imagens: fontes permitidas, licenças, atribuição, formatos, tamanhos, `alt`, fallback, otimização. |
| `SEO.md` | Metadata por tipo de página, URLs, Open Graph, sitemap, robots, JSON-LD, canonical. |
| `SECURITY.md` | Ameaças (XSS, injeção, secrets, abuso de API), CSP, headers, validação, política de variáveis de ambiente. |
| `ACCESSIBILITY.md` | Checklist WCAG 2.2 AA, teclado, foco, contraste, `prefers-reduced-motion`, leitores de tela. |
| `PERFORMANCE.md` | Orçamentos (LCP, CLS, INP, bundle), estratégia de 3D, como medir (Lighthouse), checklist. |
| `ANIMATIONS.md` | Catálogo de animações, durações, easings, onde usar, versão com movimento reduzido. |
| `TESTING.md` | Estratégia de testes (unitário, componente, E2E, acessibilidade), o que testar primeiro, como rodar. |
| `README.md` | Como instalar, rodar, testar e fazer build (passo a passo para iniciante, em PowerShell). |
| `CHANGELOG.md` | Histórico de mudanças por versão. |
| `.env.example` | Variáveis de ambiente documentadas, **sem valores secretos**. |
| `.gitignore`, `.editorconfig`, `.prettierrc`, `eslint.config.mjs` | Configurações padrão do repositório. |

> Depois de criar os documentos: **parar, resumir para o usuário em linguagem simples e pedir aprovação** antes da Fase 1.

---

## 5. STACK E FERRAMENTAS

Regra: **cada dependência precisa de justificativa técnica registrada em `ARCHITECTURE.md`.** Não adicionar biblioteca só por ser popular. Ao final da Fase 0, confirmar versões atuais consultando a documentação oficial (as versões mudam).

### 5.1 Base (obrigatória)
| Ferramenta | Uso | Justificativa |
|---|---|---|
| **Node.js (LTS)** | Ambiente de execução | Já instalado; requisito do Next.js |
| **TypeScript (strict)** | Linguagem | Tipagem forte nas entidades; menos bugs |
| **React** | UI | Componentização |
| **Next.js (App Router)** | Framework | SSG/ISR para SEO, roteamento por arquivo, metadata API, `next/image`, `next/font`, code splitting |
| **Tailwind CSS** | Estilos | Tokens/tema centralizados, consistência, ótimo para design system |
| **Git + GitHub** | Versionamento | Já instalado; commits pequenos e frequentes |
| **pnpm** (ou npm) | Gerenciador de pacotes | Decidir na Fase 0 e registrar; **se pnpm causar atrito no Windows, usar npm** |

### 5.2 UI e componentes
| Ferramenta | Uso | Observação |
|---|---|---|
| **Radix UI** (ou shadcn/ui sobre Radix) | Primitivos acessíveis (dialog, popover, tabs, select, tooltip, accordion) | Acessibilidade pronta (foco, teclado, ARIA) |
| **class-variance-authority + clsx + tailwind-merge** | Variantes de componentes e mescla de classes | Evita "centenas de classes repetidas" |
| **Lucide React** (ou Phosphor) | Ícones | Consistentes e leves (importar só os usados) |
| **next/font** | Fontes | Self-host, sem CLS; escolher serifada editorial + sans de leitura |

### 5.3 Dados, validação e estado
| Ferramenta | Uso | Observação |
|---|---|---|
| **Zod** | Validar dados (entidades, query params, formulários) | Tipos derivados via `z.infer`; garante que dado inválido não quebra a UI |
| **Dados locais tipados (JSON/TS) + repositórios** | Fase inicial | Camada `services/` abstrai a fonte → trocar por API/BD depois sem refazer UI |
| **Zustand** (com `persist`) | Favoritos/lista pessoal no `localStorage` | Leve; sem backend na v1 |
| **TanStack Query** | *Somente se* houver dados remotos | Não adicionar enquanto os dados forem locais |
| **Banco futuro (avaliar)**: PostgreSQL via **Supabase** ou **Neon** + **Drizzle** ou **Prisma** | Fase futura | **Não criar banco só para favoritos** |

### 5.4 Busca e filtros
| Ferramenta | Uso | Observação |
|---|---|---|
| **Fuse.js** (ou **MiniSearch**/**Orama**) | Busca fuzzy no cliente (tolerância a erros de digitação, autocomplete) | Adequado para catálogo pequeno/médio |
| **Meilisearch / Typesense / Algolia** | Escala futura | Só se o catálogo crescer muito |
| **nuqs** (ou `URLSearchParams`) | Filtros na URL (compartilháveis, indexáveis, botão voltar funciona) | Filtros combinados refletidos na URL |

### 5.5 Animações
| Ferramenta | Uso | Observação |
|---|---|---|
| **Motion** (ex-Framer Motion) | Entradas, hover, layout, transições entre páginas/filtros | Principal |
| **GSAP + ScrollTrigger** | Storytelling por scroll, se necessário | Avaliar; **evitar duplicar** com Motion — decidir em `DECISIONS.md` |
| **Lenis** (opcional) | Scroll suave | Só se agregar; desativar com movimento reduzido |
| **CSS transitions / View Transitions API** | Microinterações simples | Preferir CSS quando bastar |
| **`prefers-reduced-motion`** | Respeito obrigatório | Experiência completa sem animação |

### 5.6 3D
| Ferramenta | Uso | Observação |
|---|---|---|
| **Three.js + React Three Fiber + drei** | Garrafa 3D interativa, partículas sutis, elementos decorativos | **Carregar sob demanda** (`dynamic import`, `ssr: false`), fora do caminho crítico |
| **Modelos GLB otimizados** (gltf-transform / Draco / KTX2) | Ativos 3D | Peso mínimo; **modelo 3D genérico de garrafa é permitido como elemento decorativo/interativo, mas NUNCA deve ser apresentado como fotografia de um rótulo específico** |
| **Detecção de capacidade** | Fallback | Em mobile/dispositivo fraco/movimento reduzido → versão simplificada (imagem real estática) |

### 5.7 Mapas
| Ferramenta | Uso | Observação |
|---|---|---|
| **MapLibre GL** ou **Leaflet/react-leaflet** + tiles OpenStreetMap (ou provedor com licença adequada) | Mapas reais de regiões/países | **Proibido desenhar mapas falsos em HTML**; respeitar atribuição de licença; dados geográficos (GeoJSON) de fonte confiável |

### 5.8 Imagens e mídia
| Ferramenta | Uso |
|---|---|
| **next/image** (+ `sharp`) | Otimização, responsivo, lazy loading, AVIF/WebP |
| **Wikimedia Commons / Wikidata API** | Fotos com licença livre e dados estruturados (citar licença/autor) |
| **Sites oficiais / press kits de produtores** | Imagens de rótulos/vinhos (verificar termos de uso/autorização) |
| **Unsplash / Pexels** | Somente imagens **ambientais/genéricas** (paisagens de vinhedo, cenas) — **nunca** para representar um rótulo ou vinícola específicos |

### 5.9 Qualidade, testes e ferramentas de desenvolvimento
| Ferramenta | Uso |
|---|---|
| **ESLint** (config Next + TypeScript) | Lint |
| **Prettier** (+ plugin Tailwind) | Formatação e ordenação de classes |
| **Husky + lint-staged** | Checar antes do commit |
| **Vitest + Testing Library** | Testes unitários e de componentes |
| **Playwright** | Testes E2E (busca, filtros, favoritos, navegação) |
| **@axe-core/playwright** (e/ou `eslint-plugin-jsx-a11y`) | Acessibilidade automatizada |
| **Lighthouse / Lighthouse CI** | LCP, CLS, INP, performance, SEO, a11y |
| **@next/bundle-analyzer** | Tamanho de bundles |
| **Conventional Commits** | Padrão de mensagens de commit |

### 5.10 SEO e segurança
| Ferramenta | Uso |
|---|---|
| **Metadata API do Next.js**, `sitemap.ts`, `robots.ts`, `opengraph-image` | SEO técnico |
| **schema-dts** + JSON-LD | Dados estruturados (Article, BreadcrumbList, Organization, Product *sem preço/oferta* quando apropriado — evitar marcar como venda) |
| **Security headers + CSP** (`next.config`) | XSS e clickjacking |
| **Zod + validação server-side** | Nunca confiar em dados do cliente |
| **`.env.local` / `.env.example`** | Secrets fora do código; **nunca** expor chaves privadas no frontend (só `NEXT_PUBLIC_*` para valores públicos) |
| **Rate limiting** (se houver API própria) | Abuso de API |

### 5.11 Deploy e ambiente
| Ferramenta | Uso |
|---|---|
| **Vercel** | Hospedagem natural para Next.js (há conector MCP da Vercel disponível no ambiente — usar somente quando o usuário pedir deploy) |
| **GitHub Actions** | CI: lint + typecheck + testes + build |
| **VS Code + extensão Claude Code** | Ambiente de desenvolvimento (Windows 11 / PowerShell) |
| **Skills/MCPs disponíveis** | Consultar na Fase 0 quais existem (ex.: `frontend-design`, conectores de design/documentação) e registrar em `ARCHITECTURE.md` quais serão usados e para quê |

### 5.12 O que NÃO adicionar (a menos que justificado)
Bibliotecas de UI pesadas que imponham visual próprio (Material UI, Ant Design), múltiplas libs de animação sobrepostas, gerenciadores de estado globais complexos (Redux) para algo que Zustand resolve, banco de dados na v1, SDKs de pagamento/carrinho (fora de escopo), scrapers de sites de terceiros que violem termos de uso.

---

## 6. ARQUITETURA E ESTRUTURA DE PASTAS (proposta inicial — refinar em `ARCHITECTURE.md`)

Separar: páginas, componentes, layouts, dados, serviços, tipos, utilitários, hooks, configurações, assets, estilos, integrações, validações. **Sem lógica toda em uma única página. Sem componentes gigantes.**

```
/
├─ CLAUDE.md  PRD.md  ARCHITECTURE.md  RULES.md  DESIGN.md  TASKS.md  MEMORY.md
├─ DECISIONS.md  DATA_MODEL.md  DATA_SOURCES.md  IMAGES.md  SEO.md
├─ SECURITY.md  ACCESSIBILITY.md  PERFORMANCE.md  ANIMATIONS.md  TESTING.md
├─ README.md  CHANGELOG.md  .env.example
├─ public/                     # ícones, fontes locais, modelos GLB, favicons
├─ src/
│  ├─ app/                     # rotas (App Router)
│  │  ├─ (site)/               # home, sobre, explorar…
│  │  ├─ vinhos/[slug]/
│  │  ├─ uvas/[slug]/
│  │  ├─ regioes/[slug]/
│  │  ├─ paises/[slug]/
│  │  ├─ produtores/[slug]/
│  │  ├─ vinicolas/[slug]/
│  │  ├─ harmonizacoes/
│  │  ├─ favoritos/
│  │  ├─ pesquisa/
│  │  ├─ sitemap.ts  robots.ts  not-found.tsx  error.tsx  loading.tsx
│  ├─ components/
│  │  ├─ ui/                   # Button, Input, Card, Badge, Dialog… (design system)
│  │  ├─ layout/               # Header, Footer, Nav, BottomNav (mobile)
│  │  ├─ wine/  grape/  region/  producer/  pairing/  search/  filters/
│  │  ├─ media/                # WineImage, ImageUnavailable, ImageCredit
│  │  ├─ three/                # cenas 3D (carregadas sob demanda)
│  │  └─ motion/               # wrappers de animação
│  ├─ data/                    # dados locais tipados (demo claramente marcado)
│  ├─ services/                # repositórios: getWines, getGrapes… (abstraem a fonte)
│  ├─ types/                   # entidades TypeScript
│  ├─ schemas/                 # Zod
│  ├─ hooks/                   # useFavorites, useSearch, useReducedMotion…
│  ├─ lib/                     # utils, formatadores, slug, seo, config
│  ├─ stores/                  # Zustand
│  ├─ styles/                  # globals.css, tokens
│  └─ config/                  # site config, constantes, feature flags
├─ tests/  (unit, e2e)
└─ .github/workflows/
```

---

## 7. MODELO DE DADOS

Tipagem forte em TypeScript + validação Zod. Relações por **ID/slug** (sem duplicar informação). Entidades:

`Wine`, `Producer`, `Winery`, `Grape`, `Region`, `Country`, `Vintage`, `WineStyle`, `Pairing`, `Source`, `ImageAsset`.

### 7.1 Campos possíveis de `Wine` (todos opcionais, exceto identidade)
nome, produtor, vinícola, país, região, sub-região, safra, tipo, estilo, uvas, **percentual das uvas (só se confirmado)**, **teor alcoólico (só se confirmado)**, volume, características, perfil aromático, perfil de sabor, corpo, acidez, taninos, doçura, temperatura de serviço, **potencial de guarda (só com fonte confiável)**, harmonizações, método de produção, informações da vinícola, história, imagem, **fontes**.

### 7.2 Regra de fonte por campo
Cada afirmação relevante referencia uma `Source`:
```ts
type Source = {
  id: string;
  kind: 'producer' | 'winery' | 'official-distributor' | 'institution' | 'specialized-database' | 'technical' | 'other';
  label: string;        // ex.: "Site oficial do produtor"
  url?: string;
  accessedAt: string;   // data de consulta
  reliability: 'primary' | 'secondary';
};
type Sourced<T> = { value: T; sourceIds: string[] };
```
Campo sem fonte confiável → **não existe** (a UI lida elegantemente com ausência). Nunca "0", "N/A inventado" ou valor default falso.

### 7.3 Categorias
Tintos, brancos, rosés, espumantes, fortificados, de sobremesa, naturais (quando aplicável), outros estilos relevantes. Descoberta por: país, região, uva, produtor, vinícola, estilo, safra, características.

---

## 8. FONTES E TRANSPARÊNCIA

Hierarquia (usar a de cima sempre que existir):
1. site oficial do produtor/vinícola; documentação/ficha técnica oficial;
2. distribuidor oficial / importador;
3. instituições e órgãos do setor (denominações de origem, organizações reconhecidas);
4. bases especializadas e técnicas confiáveis;
5. enciclopédias/bases abertas (ex.: Wikidata) — apenas como apoio, com verificação cruzada.

- **Nunca** usar fonte duvidosa quando existir fonte primária.
- **Nunca** copiar texto de terceiros: reescrever com palavras próprias e citar a fonte (respeitar direitos autorais).
- A UI deve permitir exibir "Fonte: produtor oficial" / "Fonte: instituição X" e uma seção de referências na página do vinho.
- Não fazer scraping que viole termos de uso ou `robots.txt`.

---

## 9. ESTRATÉGIA DE IMAGENS

```ts
type ImageAsset = {
  id: string;
  src: string;
  alt: string;              // descritivo, em português
  width: number; height: number;
  credit: string;           // autor/detentor
  license: string;          // ex.: "CC BY-SA 4.0", "Uso autorizado pelo produtor"
  sourceUrl: string;        // origem verificável
  subjectType: 'wine' | 'producer' | 'winery' | 'region' | 'grape' | 'ambient';
  subjectId?: string;       // deve corresponder à entidade exibida
};
```
- Imagem de vinho/vinícola/região específica → apenas imagem **real e correspondente**; verificar licença.
- Imagens `ambient` (paisagem genérica) só em contextos editoriais genéricos e **rotuladas como ilustrativas**.
- Boa resolução, proporção adequada, `next/image` com `sizes`, lazy loading (exceto LCP: `priority`), AVIF/WebP, `alt` obrigatório, tratamento por tamanho de tela.
- Sem imagem → componente `ImageUnavailable` (honesto, elegante, sem inventar).

---

## 10. BUSCA (funcionalidade principal)

Pesquisa por: nome do vinho, produtor, vinícola, uva, região, país, estilo.
Requisitos: **autocomplete**, sugestões, resultados instantâneos, **tolerância a erros de escrita e acentos** (normalização), filtros, ordenação, paginação ou carregamento progressivo, estado de URL compartilhável, atalho de teclado (ex.: `/` ou `Ctrl+K`), acessível por teclado e leitor de tela (padrão combobox).

## 11. FILTROS

Tipo, país, região, uva, produtor, safra, estilo, corpo, acidez, taninos, doçura, características aromáticas e gustativas. **Combináveis**. Exemplo alvo: *"vinhos tintos italianos feitos principalmente com determinada uva"*. Filtros ativos sempre visíveis (chips removíveis), contagem de resultados, "limpar tudo". No mobile: painel deslizante (bottom sheet) com aplicar/limpar. Só oferecer opções de filtro que existam nos dados reais (sem opções vazias).

---

## 12. PÁGINAS E ROTAS

Preparar a estrutura para (implementação incremental; não é preciso fazer todas de uma vez):
Home · Pesquisa · Resultados · Vinho individual · Vinhos · Uvas · Uva individual · Regiões · Região individual · Países · País individual · Produtores · Produtor individual · Vinícolas · Vinícola individual · Harmonizações · Favoritos · Explorar · Sobre o projeto.

URLs amigáveis em português com slug (`/vinhos/nome-do-vinho`), canonical, metadata própria por página.

### 12.1 Home
Porta de entrada com **storytelling** (não uma parede de cards sem hierarquia): apresentação, pesquisa principal, descobrir um vinho, regiões em destaque, uvas, estilos, produtores, conteúdo educativo, exploração visual, chamadas para explorar.

### 12.2 Página do vinho
Editorial e sofisticada (não uma grande tabela): foto principal, nome, produtor, região, país, resumo, características, ficha técnica, uvas, perfil sensorial visual, harmonizações, história, informações da vinícola, região produtora, vinhos relacionados, **fontes utilizadas**.

### 12.3 Regiões
Países, regiões, sub-regiões, principais uvas, estilos, clima, terroir, produtores relevantes; **mapas reais** via biblioteca apropriada.

### 12.4 Uvas
Nome, origem, principais regiões, características, perfil aromático/de sabor, estilos associados, exemplos de vinhos, imagens reais; navegar da uva para vinhos relacionados.

### 12.5 Produtores e vinícolas
Nome, país, região, história, localização, principais vinhos, imagens, site oficial, informações verificadas; relações produtor–vinícola–vinho baseadas em **dados reais**.

### 12.6 Harmonização
Carnes, massas, queijos, frutos do mar, sobremesas, vegetarianos, culinárias específicas. Apresentar como **orientação gastronômica**, nunca "a única combinação correta".

### 12.7 Descoberta
"Descubra um vinho", "Explore uma região", "Conheça uma nova uva", "Explore vinhos semelhantes", "Continue explorando", "Vinhos relacionados", "Da mesma região", "Produzidos com a mesma uva" — sempre calculados a partir dos **dados reais** (relações entre entidades).

### 12.8 Favoritos
v1 em `localStorage` (Zustand persist): favoritar vinhos, salvar produtores e regiões, lista pessoal. Arquitetura preparada para migrar a backend depois. Sem conta, sem banco na v1. Tratar `localStorage` indisponível/corrompido.

### 12.9 Perfil sensorial
Representação visual de corpo, acidez, taninos, doçura, intensidade aromática. **Só exibir atributos com fonte**; atributo sem fonte → não mostrar valor (nunca inventar nota).

---

## 13. DESIGN SYSTEM (definir ANTES das páginas — detalhar em `DESIGN.md`)

Definir: cores, tipografia, escalas, espaçamento, bordas, sombras, raios, ícones, botões, inputs, cards, badges, componentes de navegação, estados, animações.

Tailwind de forma profissional: tokens no tema (CSS variables/`@theme`), espaçamento e tipografia consistentes, breakpoints mobile-first, dark/light **só se fizer sentido** (decidir na Fase 0), componentes reutilizáveis com variantes (CVA). Componentes obrigatórios: botões, cards, inputs, filtros, badges, menus, modais, seções, cabeçalhos, rodapés, navegação.

Paleta sugerida a explorar (validar contra referências): tons profundos e sóbrios inspirados em vinho e terroir (borgonha/bordô profundo, grafite, marfim/creme, dourado discreto) — **com poucos acentos**; tipografia com **serifada editorial** para títulos + **sans legível** para interface e dados.

---

## 14. ANIMAÇÕES

Usar com propósito: entrada de elementos, transições entre páginas, cards, imagens, menus, filtros, pesquisa, carregamento, hover, scroll, mudança de seção, apresentação de informação.
Suaves, modernas, curtas. **Evitar**: exageros, efeitos piscantes, movimento constante, excesso de parallax, qualquer coisa que atrapalhe a leitura.
**Obrigatório**: respeitar `prefers-reduced-motion` — experiência completa sem animações.

## 15. 3D

Complemento, **não** demonstração técnica de WebGL. Possibilidades: garrafa 3D interativa (modelo genérico, decorativo), elementos abstratos, partículas sutis, transições, ambiente de vinhedo. Regras: carregar sob demanda, fora do LCP; pausar quando fora da viewport; limitar DPR; fallback estático para mobile/dispositivo fraco/movimento reduzido; medir impacto no Lighthouse. **Performance > 3D.**

---

## 16. RESPONSIVIDADE (mobile-first)

Funcionar muito bem em celular, tablet, notebook, desktop e monitores grandes. **Não apenas encolher o desktop**: decisões próprias de UX mobile — áreas de toque (≥ 44×44 px), navegação inferior ou menu apropriado, tamanho de fonte, imagens, performance, gestos, filtros em bottom sheet, busca em destaque, carregamento progressivo.

## 17. ACESSIBILIDADE

HTML semântico, navegação por teclado completa, foco visível, contraste adequado (WCAG AA), `aria-label` quando necessário, `alt` em imagens, `prefers-reduced-motion`, alvos de toque adequados, compatibilidade com leitores de tela (combobox de busca, diálogos, filtros, gráficos do perfil sensorial com alternativa textual). Testar com axe.

## 18. PERFORMANCE

Otimização de imagens, lazy loading, code splitting, carregamento sob demanda, cache, compressão, otimização de fontes, menos JS desnecessário, 3D otimizado. Monitorar **LCP, CLS, INP**, tamanho dos bundles, número de requisições. Meta: **Lighthouse ≥ 90** em Performance, Acessibilidade, Boas práticas e SEO nas páginas principais (registrar orçamentos em `PERFORMANCE.md`). Preferir Server Components; `"use client"` só onde houver interatividade.

## 19. SEO

Metadata por página, títulos corretos, descriptions, URLs amigáveis, Open Graph, Twitter/X Cards, `sitemap`, `robots`, dados estruturados quando apropriado, páginas indexáveis, canonical. **Páginas de vinho com metadata própria.** Não marcar conteúdo como oferta/produto à venda.

## 20. SEGURANÇA

Proteger contra XSS, injeção, exposição de secrets, requisições maliciosas, abuso de APIs e dados manipulados no cliente. Nunca colocar API keys privadas, tokens ou credenciais no frontend; usar variáveis de ambiente (`.env.local` fora do Git). Sanitizar qualquer HTML externo, validar entradas com Zod, definir CSP e headers de segurança, manter dependências atualizadas (`npm audit`/`pnpm audit`).

## 21. CONSUMO RESPONSÁVEL

Plataforma de **conhecimento e descoberta**, não de incentivo ao consumo. Sem linguagem que estimule abuso. Aviso de consumo responsável no rodapé/páginas relevantes; **verificação de maioridade** (18+) a decidir na Fase 0 conforme a legislação aplicável (registrar em `DECISIONS.md`). Bebida alcoólica: proibida para menores de 18 anos.

## 22. ESTADOS DA INTERFACE

Toda funcionalidade tem: loading, skeleton, sucesso, erro, vazio, sem resultados, imagem indisponível, conexão lenta, dados incompletos. **Nenhuma tela quebra por informação ausente.**

## 23. UX

O usuário entende rapidamente: o que é o site, como pesquisar, como explorar, como voltar, onde está, que informações vê (breadcrumbs, títulos claros). Evitar menus complexos, excesso de pop-ups e obrigatoriedade de conta.

---

## 24. QUALIDADE DE CÓDIGO

Código de produção. Usar TypeScript corretamente (`strict`, sem `any` sem justificativa), tipos/interfaces, componentes reutilizáveis, funções pequenas, arquitetura clara, tratamento de erros, validações.
Evitar: código duplicado, componentes desnecessários, nomes genéricos, arquivos gigantes (referência: > ~200 linhas por componente merece divisão), gambiarras, dependências inúteis, dados hardcoded espalhados, comentários desnecessários, código gerado sem propósito claro.

## 25. DESENVOLVIMENTO COM IA

A IA **não gera código sem validação**. Toda implementação deve ser revisada, testada, compreendida, otimizada e integrada corretamente. **A IA nunca inventa informações sobre vinhos.** Se precisar de dados reais → buscar fontes confiáveis (com busca na web quando disponível) ou marcar explicitamente como demonstração.

---

## 26. FLUXO DE TRABALHO

- Trabalhar em **tarefas pequenas**, uma por vez, seguindo `TASKS.md`.
- Antes de codar: dizer o plano em 2–4 linhas. Depois de codar: rodar `lint`, `typecheck`, testes e `build`.
- **Commits pequenos** com Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Não commitar `.env*` nem `node_modules`.
- Ao final de cada sessão: atualizar `MEMORY.md` (estado/decisões/pendências) e `TASKS.md` (status).
- Pedir confirmação antes de: instalar dependência nova, mudar arquitetura, deletar arquivos, publicar/deploy.
- Ao instalar dependência: registrar nome, versão, motivo e alternativa considerada em `ARCHITECTURE.md`.

### Comandos esperados (ajustar após o scaffold; PowerShell)
```powershell
# instalar dependências
npm install            # ou: pnpm install
# desenvolvimento
npm run dev
# qualidade
npm run lint
npm run typecheck      # tsc --noEmit
npm run test           # vitest
npm run test:e2e       # playwright
npm run build
```

---

## 27. ROADMAP POR FASES

| Fase | Objetivo | Saída |
|---|---|---|
| **0 — Descoberta e documentação** | Análise (seção 4.1) + todos os docs (4.2, 4.3) | Docs aprovados pelo usuário |
| **1 — Fundação** | Scaffold Next.js + TS + Tailwind, lint/format/testes, CI, tokens do Design System, componentes base (`ui/`), layout (Header/Footer/Nav mobile) | Projeto rodando e validado |
| **2 — Dados e serviços** | Tipos, schemas Zod, repositórios, `Source`/`ImageAsset`, primeiro conjunto **real e verificado** de dados (pequeno) | Camada de dados testada |
| **3 — Busca e catálogo** | Busca com autocomplete, filtros combinados, listagem, estados de UI | Pesquisa funcional |
| **4 — Páginas de entidade** | Vinho, uva, região, país, produtor/vinícola, harmonizações, relações "relacionados" | Navegação completa entre entidades |
| **5 — Home e storytelling** | Home editorial, explorar, sobre | Porta de entrada |
| **6 — Favoritos** | Zustand + localStorage | Lista pessoal |
| **7 — Animações** | Transições/microinterações com movimento reduzido | Experiência refinada |
| **8 — 3D** | Elemento 3D sob demanda + fallback | Diferencial visual sem custo de performance |
| **9 — Mapas** | Mapas reais de regiões | Exploração geográfica |
| **10 — SEO, a11y, performance, segurança** | Auditorias e correções, Lighthouse, axe | Metas atingidas |
| **11 — Deploy** | Vercel + variáveis de ambiente | Site publicado |

---

## 28. DEFINITION OF DONE (cada tarefa)

- [ ] Critério de aceite em `TASKS.md` atendido
- [ ] Nenhuma informação inventada; fontes registradas
- [ ] Sem `any` injustificado; tipos e Zod ok
- [ ] Estados de UI tratados (loading/erro/vazio/dados incompletos/sem imagem)
- [ ] Responsivo (mobile-first) e testado em 3 larguras
- [ ] Acessível (teclado, foco, contraste, movimento reduzido)
- [ ] `lint`, `typecheck`, testes e `build` passando
- [ ] Sem regressão visível de performance (LCP/CLS/INP)
- [ ] Docs (`MEMORY.md`, `TASKS.md`, `DECISIONS.md` se aplicável) atualizados

---

## 29. RISCOS TÉCNICOS A ANALISAR NA FASE 0

1. **Fonte de dados real**: obter dados verificados de vinhos com licença adequada (maior risco do projeto); definir processo de curadoria e verificação.
2. **Direitos de imagem**: licenças, autorização de produtores, atribuição; risco de ficar sem imagem para muitos vinhos.
3. **Direitos autorais de texto**: não copiar descrições de terceiros.
4. **Performance com 3D** em dispositivos fracos; peso de modelos GLB.
5. **Busca fuzzy no cliente** com catálogo grande (tamanho do índice); plano de migração para motor de busca.
6. **SEO de páginas geradas em volume** (ISR/SSG, tamanho de sitemap).
7. **Mapas**: licença de tiles, peso de bibliotecas, dados GeoJSON confiáveis.
8. **Conteúdo sobre álcool**: requisitos legais/de plataforma (verificação de idade, publicidade).
9. **Complexidade para iniciante**: manter stack enxuta, explicar decisões, evitar dependências desnecessárias.
10. **Sobreposição de bibliotecas de animação** (Motion × GSAP): decidir uma principal.

---

## 30. REGRA FINAL

O projeto deve parecer uma **plataforma real e profissional de pesquisa sobre vinhos** — não um simples "site bonito", e sim a **base de um produto digital** que possa evoluir para uma plataforma completa.

Em caso de dúvida: **veracidade > usabilidade > performance > estética**. Se uma informação não puder ser confirmada, **não a invente**.

### Primeira ação ao abrir este projeto
1. Ler `CLAUDE.md`, `MEMORY.md`, `TASKS.md` (se existirem).
2. Se os documentos da Fase 0 ainda **não existem** → executar a Fase 0 (seção 4) e **parar para aprovação**.
3. Se já existem → continuar pela próxima tarefa pendente em `TASKS.md`.