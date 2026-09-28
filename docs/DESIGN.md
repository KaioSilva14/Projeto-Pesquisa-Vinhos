# DESIGN — Design System do Vinum

> Versão 0.1 · Fase 0 · 2026-09-28
> Tokens definidos aqui serão implementados em `src/styles/globals.css` (Tailwind v4, bloco `@theme`) na Fase 1.
> Nenhuma cor, tamanho ou espaçamento "solto" no código: tudo sai destes tokens.

---

## 1. Leitura de design (design read)

**Plataforma editorial de referência sobre vinhos para adultos curiosos e entusiastas, com linguagem de revista/enciclopédia contemporânea, apoiada em Tailwind v4 + Radix, tipografia serifada editorial nos títulos e sans neutra na interface, movimento contido.**

Não é uma landing page: é um **produto de consulta** (busca, filtros, fichas) com **camada editorial** (home, páginas de região/uva). Por isso o sistema tem dois "modos de densidade" (ver §1.1).

### 1.1 Parâmetros de composição

| Parâmetro | Editorial (home, uva, região, sobre) | Catálogo (busca, listas, filtros, ficha técnica) |
|---|---|---|
| Variação de layout (1 simétrico → 10 caótico) | 6 — assimetria controlada, imagens grandes, grid 12 colunas com deslocamentos | 3 — grid previsível, alinhamento rígido |
| Intensidade de movimento (1 → 10) | 4 — entradas suaves, hover, nada em loop | 3 — feedback imediato, transições de estado |
| Densidade visual (1 arejado → 10 denso) | 3 — muito respiro | 5 — informação organizada, sem aperto |

### 1.2 Princípios

1. **Conteúdo e fotografia são o design.** Decoração só quando organiza informação.
2. **Hierarquia por tipografia e espaço**, não por caixas, sombras e gradientes.
3. **Um acento, usado com parcimônia** (bordô). O resto é neutro.
4. **Honestidade visual**: ausência de dado ou imagem é mostrada com elegância, nunca disfarçada.
5. **Mobile não é desktop encolhido**: decisões próprias para toque e telas pequenas.
6. **Calma**: nada pisca, nada se move sem motivo.

### 1.3 Anti-padrões proibidos

Gradientes roxos/azuis de IA · brilhos neon · glassmorphism em tudo · "três cards iguais lado a lado" como padrão · rótulos em caixa-alta acima de toda seção · contadores/números decorativos ("01 / 04") · pontos coloridos decorativos · selos sobre fotos · sombras pretas pesadas · textos "criativos" vazios ("eleve sua experiência") · ilustrações de garrafa/vinhedo em SVG/CSS · barras de progresso com trilho cheio para perfil sensorial · travessão (—) em textos da interface (usar ponto, vírgula, dois-pontos ou hífen).

---

## 2. Cores

Paleta **"Adega"**: marfim-pedra + grafite frio + bordô profundo, com ouro-velho **apenas** em detalhes decorativos mínimos. Justificativa: a paleta sugerida no `CLAUDE.md` pede bordô/grafite/marfim/dourado; para não cair no clichê "bege + latão + marrom-café", o grafite é **frio** (não café), o fundo é marfim **acinzentado** (não creme amarelado) e o dourado quase não aparece.

### 2.1 Tokens semânticos — tema claro (padrão)

| Token | Hex | Uso | Contraste medido |
|---|---|---|---|
| `--color-bg` | `#F5F4F0` | Fundo da página | — |
| `--color-surface` | `#FBFAF8` | Superfícies elevadas (cards, popovers, sheet) | — |
| `--color-sunken` | `#ECEAE4` | Áreas rebaixadas (skeleton, `ImageUnavailable`, blocos de ficha) | — |
| `--color-text` | `#1C1C1F` | Texto principal (grafite) | 15,45:1 no bg |
| `--color-text-muted` | `#4F4F55` | Texto secundário | 7,39:1 no bg |
| `--color-text-subtle` | `#66666C` | Legendas, créditos, metadados | 5,18:1 no bg · 4,74:1 no sunken |
| `--color-accent` | `#6B1D2F` | Bordô: links, botão primário, foco, estado ativo | 10,36:1 no bg |
| `--color-accent-hover` | `#561626` | Hover/pressionado do acento | 12,40:1 no bg |
| `--color-on-accent` | `#F5F4F0` | Texto sobre o acento | 10,36:1 |
| `--color-accent-soft` | `#F3E6E9` | Fundo de chip selecionado / destaque suave | texto 14,01:1 · acento 9,40:1 |
| `--color-detail` | `#7E6430` | Ouro-velho: fios e ornamentos editoriais **apenas** | 5,08:1 no bg |
| `--color-border` | `#D9D6CE` | Divisores decorativos (não usar como única borda de campo) | 1,32:1 (decorativo) |
| `--color-border-strong` | `#85827A` | Borda de inputs, checkboxes, controles | 3,49:1 bg · 3,68:1 surface · 3,19:1 sunken |
| `--color-success` | `#2F6B45` | Estados de sucesso | 5,76:1 |
| `--color-warning` | `#80530A` | Avisos (inclui selo "Dados de demonstração") | 6,04:1 |
| `--color-danger` | `#9E2A2A` | Erros | 6,77:1 |
| `--color-info` | `#2D5B87` | Informação neutra | 6,45:1 |

### 2.2 Tokens semânticos — tema escuro

| Token | Hex | Contraste medido |
|---|---|---|
| `--color-bg` | `#141416` | — |
| `--color-surface` | `#1C1C1F` | — |
| `--color-surface-raised` | `#242428` | — |
| `--color-sunken` | `#0F0F11` | — |
| `--color-text` | `#EDEBE6` | 15,44:1 no bg |
| `--color-text-muted` | `#B8B6B0` | 9,07:1 |
| `--color-text-subtle` | `#9A9893` | 6,38:1 |
| `--color-accent` | `#DB909F` | 7,45:1 no bg |
| `--color-accent-hover` | `#E7AEB9` | 9,77:1 |
| `--color-on-accent` | `#141416` | 7,45:1 |
| `--color-accent-soft` | `#3A2429` | texto 12,04:1 · acento 5,81:1 |
| `--color-detail` | `#C9AB72` | 8,37:1 |
| `--color-border` | `#34343A` | decorativo |
| `--color-border-strong` | `#6E6E76` | 3,64:1 bg · 3,36:1 surface · 3,06:1 raised |
| `--color-success` | `#7CC194` | 8,68:1 |
| `--color-warning` | `#E0B25E` | 9,37:1 |
| `--color-danger` | `#EE8A8A` | 7,57:1 |
| `--color-info` | `#8DB7E0` | 8,75:1 |

Contrastes calculados com a fórmula WCAG 2.x em 2026-09-28. **Revalidar com ferramenta (axe/Lighthouse) na Fase 1.**

### 2.3 Regras de uso de cor

- O **acento é o único matiz forte** do site. Nada de azul em um botão e verde em outro.
- Cores de estado (success/warning/danger/info) **somente** para estados, sempre acompanhadas de ícone ou texto (nunca só cor).
- Tipos de vinho (tinto, branco, rosé…) **não** ganham cores próprias: são identificados por texto/badge neutro. Evita arco-íris e problemas de daltonismo.
- Fotografia traz a cor; a interface fica neutra ao redor dela.
- Proibido `#000000` e `#FFFFFF` puros.

### 2.4 Tema claro/escuro (ADR-010)

- Tokens como variáveis CSS; tema escuro aplicado via `@media (prefers-color-scheme: dark)` **e** atributo `data-theme="dark"` no `<html>` (para um seletor manual futuro).
- v1: segue a preferência do sistema. Seletor manual (claro/escuro/sistema) entra na v1 se houver tempo, persistido em `localStorage`, aplicado antes da pintura para evitar flash.
- Um tema por página inteira: seções não invertem de tema no meio da rolagem.
- Imagens: sem filtros no escuro. `ImageUnavailable` usa `--color-sunken` do tema.

---

## 3. Tipografia

### 3.1 Famílias (ADR-011)

| Papel | Fonte | Por quê |
|---|---|---|
| **Títulos editoriais** (display, h1–h3, citações) | **Newsreader** (variável, eixo de tamanho óptico `opsz`, licença OFL, via `next/font/google`) | Serifada desenhada para leitura editorial em tela; o eixo `opsz` ajusta o desenho para tamanhos grandes (títulos) e pequenos; tem itálico real. Justificativa editorial explícita (publicação de referência sobre um tema de tradição) |
| **Interface e dados** (texto corrido, botões, filtros, fichas) | **Hanken Grotesk** (variável, OFL) | Sans neutra e calorosa, boa legibilidade em tamanhos pequenos, suporte completo a acentos do português; alternativa ao Inter (evitado por ser padrão de template) |
| **Números em fichas** | Hanken Grotesk com `font-variant-numeric: tabular-nums` | Alinhamento de safras, percentuais e teores |

Regras:
- Máximo **2 famílias**. Sem terceira fonte decorativa.
- Ênfase dentro de um título: **itálico da mesma família** (Newsreader itálico), nunca troca de família no meio da frase.
- Evitar pesos ≤ 300 em textos < 20 px.
- Proibidos como padrão: Inter, Fraunces, Instrument Serif.
- Carregar apenas os subconjuntos `latin` + `latin-ext`, `display: swap`, variáveis CSS `--font-serif` e `--font-sans`.

### 3.2 Escala tipográfica (fluida, base 16 px)

| Token | Tamanho | Altura de linha | Família / peso | Uso |
|---|---|---|---|---|
| `text-display` | `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)` (40→72 px) | 1.05 (1.1 se houver itálico com descendentes) | Serif 400, `opsz` automático, tracking -0.02em | Título da home / abertura de região |
| `text-h1` | `clamp(2.125rem, 1.6rem + 2.2vw, 3.25rem)` (34→52 px) | 1.1 | Serif 400 | Título da página (nome do vinho) |
| `text-h2` | `clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)` (28→40 px) | 1.15 | Serif 400 | Títulos de seção |
| `text-h3` | `1.5rem` (24 px) | 1.25 | Serif 500 | Subseções, título de card grande |
| `text-h4` | `1.25rem` (20 px) | 1.3 | Sans 600 | Títulos de bloco de interface |
| `text-lead` | `1.25rem` (20 px) | 1.55 | Sans 400 | Resumo/abertura |
| `text-body-lg` | `1.125rem` (18 px) | 1.65 | Sans 400 | Texto editorial longo |
| `text-body` | `1rem` (16 px) | 1.6 | Sans 400 | Padrão |
| `text-small` | `0.875rem` (14 px) | 1.5 | Sans 400/500 | Metadados, labels de filtro |
| `text-caption` | `0.8125rem` (13 px) | 1.45 | Sans 400 | Créditos de imagem, fontes. **Mínimo absoluto** |
| `text-overline` | `0.75rem` (12 px) | 1.4 | Sans 600, caixa-alta, tracking 0.12em | Rótulo de categoria. **No máximo 1 a cada 3 seções** |

- Largura máxima de leitura: `65ch` (texto corrido), `45ch` (resumos/leads).
- Inputs com fonte ≥ 16 px no mobile (evita zoom automático do iOS).

---

## 4. Espaçamento, grid e layout

### 4.1 Espaçamento

Base do Tailwind v4: `--spacing: 0.25rem` (4 px). Usar apenas múltiplos da escala.

| Contexto | Valor |
|---|---|
| Gap interno de componente | 8–12 px (`gap-2`/`gap-3`) |
| Padding de card | 16 px mobile · 20–24 px desktop |
| Gap entre cards em grid | 16 px mobile · 24–32 px desktop |
| Espaço entre título de seção e conteúdo | 24–32 px |
| Ritmo vertical entre seções — catálogo | 48 px mobile · 64 px desktop (`py-12`/`py-16`) |
| Ritmo vertical entre seções — editorial | 64 px mobile · 96–128 px desktop (`py-16`/`py-24`/`py-32`) |

### 4.2 Grid e contêineres

| Breakpoint (Tailwind padrão) | Largura | Colunas | Margem lateral | Gutter |
|---|---|---|---|---|
| base | < 640 px | 4 | 16 px | 16 px |
| `sm` | ≥ 640 px (40rem) | 4 | 24 px | 16 px |
| `md` | ≥ 768 px (48rem) | 8 | 32 px | 24 px |
| `lg` | ≥ 1024 px (64rem) | 12 | 40 px | 24 px |
| `xl` | ≥ 1280 px (80rem) | 12 | 48 px | 32 px |
| `2xl` | ≥ 1536 px (96rem) | 12 | auto (contêiner centralizado) | 32 px |

- Contêiner de conteúdo: `max-w-[80rem]` (1280 px). Contêiner editorial largo (imagens full-bleed): `max-w-[90rem]`. Texto corrido: `65ch`.
- Sempre CSS Grid para layouts; nada de matemática de porcentagem com flex.
- Altura de hero: `min-h-[100dvh]` quando for tela cheia (nunca `h-screen`).
- Layouts assimétricos acima de `md` colapsam para **coluna única** abaixo de 768 px, declarado explicitamente em cada seção.

### 4.3 Camadas (z-index) — `src/config/constants.ts`

| Camada | Valor |
|---|---|
| base | 0 |
| sticky (filtros fixos) | 20 |
| header / bottom nav | 30 |
| dropdown / popover / autocomplete | 40 |
| overlay | 50 |
| modal / sheet | 60 |
| toast | 70 |
| skip link | 80 |

---

## 5. Bordas, raios e sombras

### 5.1 Raios (regra única)

| Elemento | Raio |
|---|---|
| Fotografias e mídia | 2 px (`--radius-media`) |
| Botões, inputs, selects, cards, tooltips | 4 px (`--radius-sm`) |
| Popovers, dialogs | 8 px (`--radius-md`) |
| Bottom sheet (cantos superiores) | 16 px (`--radius-lg`) |
| Chips de filtro e badges | total (`--radius-pill`) |

Cantos quase retos transmitem precisão editorial. **Nenhum outro raio é permitido.**

### 5.2 Bordas
- 1 px. `--color-border` para divisões decorativas; `--color-border-strong` para contornos de controles (contraste ≥ 3:1).
- Listas longas: divisor **entre grupos**, não abaixo de cada linha.

### 5.3 Sombras (tingidas de grafite, nunca preto puro)

| Token | Valor (claro) | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgb(28 28 31 / 0.06)` | Header ao rolar |
| `--shadow-md` | `0 8px 24px -8px rgb(28 28 31 / 0.14)` | Popover, autocomplete, dropdown |
| `--shadow-lg` | `0 24px 48px -16px rgb(28 28 31 / 0.22)` | Dialog, bottom sheet |

No tema escuro, sombras quase não aparecem: a elevação é comunicada por `--color-surface`/`--color-surface-raised` + borda.

Cards **não** têm sombra por padrão: agrupam por espaço e borda sutil. Sombra só quando há elevação real (camadas flutuantes).

---

## 6. Ícones

- **Phosphor** (`@phosphor-icons/react`), peso `regular` na interface e `light` em ícones grandes decorativos de estados vazios. Uma única família.
- Tamanhos: 16 px (inline com texto pequeno), 20 px (padrão), 24 px (navegação). Área de toque ≥ 44×44 px independentemente do tamanho do ícone.
- Ícone sozinho sempre com `aria-label` no botão; ícone decorativo com `aria-hidden`.
- Proibido desenhar ícones SVG à mão. Proibido emoji na interface.

---

## 7. Componentes

Todos em `src/components/ui/`, com variantes via CVA, `className` sobrescrevível via `cn()` (clsx + tailwind-merge), `forwardRef` quando envolverem elemento nativo, e todos os estados abaixo.

### 7.1 Estados universais

| Estado | Tratamento |
|---|---|
| Hover | Mudança de cor/fundo em 150 ms. Só em dispositivos com hover (`@media (hover: hover)`) |
| Focus visível | Anel 2 px `--color-accent` + offset 2 px na cor do fundo (`focus-visible`). Nunca remover sem substituto |
| Active (pressionado) | `scale(0.98)` em 100 ms (desativado com movimento reduzido) |
| Disabled | Opacidade 0,5 + `cursor-not-allowed` + `aria-disabled`; nunca a única indicação de por que está desabilitado |
| Loading | Skeleton com a forma final (listas/cards) ou indicador inline no botão mantendo a largura |
| Erro | Texto em `--color-danger` + ícone, abaixo do campo, ligado por `aria-describedby` |
| Selecionado | `--color-accent-soft` de fundo + texto/ícone em `--color-accent` + `aria-pressed`/`aria-selected` |

### 7.2 Botões (`Button`)

| Variante | Visual | Uso |
|---|---|---|
| `primary` | Fundo `accent`, texto `on-accent` | 1 ação principal por área |
| `secondary` | Borda `border-strong`, fundo transparente, texto `text` | Ações secundárias |
| `ghost` | Sem borda, hover `sunken` | Ações terciárias, barras de ferramentas |
| `link` | Texto `accent` sublinhado no hover | Navegação dentro de texto |

Tamanhos: `sm` 36 px de altura (somente desktop, nunca como alvo principal de toque) · `md` 44 px (padrão) · `lg` 52 px. Rótulo de 1–3 palavras, verbo claro ("Pesquisar", "Ver vinhos", "Limpar filtros"). Rótulo nunca quebra em 2 linhas no desktop. Uma intenção = um rótulo em todo o site.

`IconButton`: 44×44 px, `aria-label` obrigatório.

### 7.3 Campos

- `Input`, `SearchInput`, `Select` (Radix), `Checkbox` (Radix), `RadioGroup`, `Switch` (se necessário).
- Label **acima** do campo (nunca placeholder como label), texto de ajuda opcional abaixo, erro abaixo.
- Altura 44 px (48 px no `SearchInput` principal). Fonte ≥ 16 px.
- `SearchInput`: ícone de lupa à esquerda, botão limpar à direita, dica de atalho (`/`) visível no desktop.

### 7.4 Chips e badges

| Componente | Uso | Visual |
|---|---|---|
| `FilterChip` | Opção de filtro alternável | Pill, borda `border-strong`; selecionado = `accent-soft` + texto `accent` + ícone de check |
| `ActiveFilterChip` | Filtro aplicado removível | Pill `accent-soft` com botão "remover [nome]" (ícone X, `aria-label`) |
| `Badge` (neutral) | Tipo de vinho, estilo, denominação | Pill pequena, `sunken` + `text-muted`, `text-small` |
| `SourceBadge` | "Fonte: produtor oficial" | Pill com ícone de documento, abre a referência |
| `DemoBadge` | "Dados de demonstração" | Pill `warning` com ícone, sempre visível no topo da entidade demo |

### 7.5 Cards

Usados **só quando agrupam uma entidade clicável**. Nunca "três cards iguais" como decoração.

| Card | Estrutura | Proporção da imagem |
|---|---|---|
| `WineCard` | Imagem da garrafa/rótulo, nome (serif), produtor, região · país, badges de tipo/safra, `FavoriteButton` | 3:4 vertical (garrafas); imagem com `object-contain` sobre `sunken` |
| `EntityCard` (uva, região, produtor, país) | Imagem, nome, 1 linha de contexto, contagem de vinhos | 4:3 ou 3:2 |
| `EditorialCard` | Imagem grande, título, resumo curto | 16:9 ou 3:2 |
| `CompactResult` | Linha para autocomplete/listas densas: miniatura 48 px, título, subtítulo, tipo | 1:1 |

Card inteiro clicável via link no título (`::after` cobrindo o card) para manter semântica e permitir botões internos (favoritar).

### 7.6 Navegação

| Componente | Especificação |
|---|---|
| `SiteHeader` | Altura 64 px desktop / 56 px mobile; logo-tipo (texto em serif), navegação principal em **uma linha** (Vinhos, Uvas, Regiões, Produtores, Harmonizações), busca (campo no desktop, ícone no mobile), Favoritos. Fixo com `--shadow-sm` após rolar |
| `BottomNav` (mobile < 768 px) | 4 itens com ícone + rótulo: Início · Pesquisar · Explorar · Favoritos. Altura 64 px + `safe-area-inset-bottom`. Item atual com `aria-current="page"` |
| `Breadcrumbs` | Em todas as páginas internas: `nav aria-label="Trilha de navegação"`, lista ordenada, separador `/` decorativo `aria-hidden`; no mobile mostra só o nível anterior ("‹ Regiões") |
| `SkipLink` | "Pular para o conteúdo", primeiro elemento focável |
| `SiteFooter` | Navegação secundária, sobre o projeto, política de fontes/imagens, **aviso de consumo responsável 18+** |

### 7.7 Sobreposições

| Componente | Base | Regras |
|---|---|---|
| `Dialog` | Radix Dialog | Foco preso, `Esc` fecha, título obrigatório, retorno do foco ao gatilho |
| `Sheet` / `BottomSheet` | Radix Dialog + estilos | Filtros no mobile: altura até 85 dvh, cabeçalho fixo (título + fechar), rodapé fixo ("Limpar" + "Ver N vinhos") |
| `Popover` / `Tooltip` | Radix | Tooltip nunca contém informação essencial; aparece também no foco |
| `Toast` | Próprio (simples) | Só para confirmações transitórias ("Adicionado aos favoritos"), `role="status"` |

### 7.8 Componentes de domínio

| Componente | Função |
|---|---|
| `EntityImage` | Resolve `ImageAsset` da entidade; renderiza `next/image` + `ImageCredit`, ou `ImageUnavailable` |
| `ImageUnavailable` | Painel `sunken` na mesma proporção da imagem esperada, ícone Phosphor `ImageBroken` (light), texto "Imagem indisponível" e, opcionalmente, "Ainda não temos uma foto com licença verificada". **Nunca** desenha garrafa ou silhueta |
| `ImageCredit` | Legenda `text-caption`: autor · licença (link) · origem (link). Em cards, fica acessível via botão "Créditos" para não poluir |
| `SourceList` | Seção "Fontes" numerada: rótulo, tipo, link externo (`rel="noopener noreferrer"`), data de consulta |
| `SensoryProfile` | Corpo, acidez, taninos, doçura, intensidade aromática. Cada atributo: rótulo + **5 segmentos discretos** (sem trilho cheio) + valor em texto ("Médio +") + fonte. Atributo sem fonte → não é exibido. Alternativa textual completa para leitor de tela (lista `dl`) |
| `FactSheet` (ficha técnica) | Agrupada em 2–3 blocos (Origem · Composição · Serviço), com `dl`; campo ausente não aparece; grupo vazio não aparece |
| `GrapeComposition` | Uvas do vinho; percentuais **só se confirmados**; sem percentuais → lista simples |
| `FavoriteButton` | `IconButton` com `aria-pressed`, rótulo "Salvar nos favoritos"/"Remover dos favoritos" |
| `IncompleteDataNote` | Nota discreta quando uma entidade tem poucos dados verificados ("Ainda estamos verificando mais informações sobre este vinho.") |

### 7.9 Estados de página

`EmptyState` (nada salvo / lista vazia, com ação para popular) · `NoResults` (busca/filtros sem resultados, com sugestões e "Limpar filtros") · `ErrorState` (erro de carregamento, com "Tentar novamente") · `Skeleton` com a forma do conteúdo final · `SlowConnection` (após 8 s de loading, mensagem de paciência + link para a home).

---

## 8. Composição editorial

- **Home**: sequência narrativa, não parede de cards. Hero com busca em destaque (título ≤ 2 linhas, subtítulo ≤ 20 palavras, 1 ação principal) → "Comece por uma uva" → "Regiões" (foto grande + lista) → "Estilos" → "Produtores" → "Aprenda" → chamada para explorar. **Cada seção com uma família de layout diferente**; no máximo 2 seções seguidas no esquema imagem ao lado do texto.
- **Página do vinho**: coluna de imagem (sticky no desktop) + coluna de conteúdo; título serif grande, produtor e região como links, resumo, ficha técnica agrupada, perfil sensorial, harmonizações, história, região produtora (link + mini mapa na v1), relacionados, fontes.
- **Hierarquia por espaço**: títulos de seção sem rótulo em caixa-alta por padrão.
- **Fotos**: grandes, sem texto sobreposto (exceto hero com scrim quando a legibilidade estiver garantida ≥ 4,5:1), sem selos sobre a imagem, crédito abaixo.
- **Fios em ouro-velho** (`--color-detail`, 1 px): apenas como separador editorial (ex.: abaixo do título da home), nunca em listas.

## 9. Diretrizes de imagem (resumo — política completa em `IMAGES.md`)

| Contexto | Proporção | Tratamento |
|---|---|---|
| Garrafa/rótulo | 3:4 | `object-contain` sobre `sunken`, sem recorte do rótulo |
| Região/paisagem | 3:2 (card) · 21:9 (hero desktop) · 4:5 (hero mobile) | `object-cover`, ponto focal definido no `ImageAsset` |
| Uva | 4:3 | `object-cover` |
| Produtor/vinícola | 3:2 | `object-cover` |
| Miniatura | 1:1 | `object-cover` (ou `contain` para garrafas) |

Imagem ambiente (genérica) só em contexto editorial genérico e com legenda "Imagem ilustrativa".

## 10. Movimento (resumo — catálogo em `ANIMATIONS.md`)

Tokens: `--duration-instant 100ms` · `--duration-fast 150ms` · `--duration-base 220ms` · `--duration-slow 320ms` · `--duration-editorial 600ms`. Easing padrão `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`. Animar apenas `transform` e `opacity`. Tudo desligado com `prefers-reduced-motion: reduce`.

## 11. Diretrizes 3D (resumo — fase 8)

- Um único uso com propósito (ex.: garrafa genérica interativa na seção educativa "anatomia de uma garrafa" ou elemento abstrato no hero). **Nunca** representa um rótulo específico nem substitui uma fotografia.
- Materiais sóbrios (vidro escuro, sem rótulo ou com rótulo neutro "Vinum"), luz suave, fundo transparente sobre `--color-bg`.
- Fallback: fotografia real ambiente estática com legenda "Imagem ilustrativa".

## 12. Padrões mobile

- Busca acessível em 1 toque (BottomNav → "Pesquisar" abre busca em tela cheia com teclado aberto).
- Filtros em bottom sheet com rodapé fixo ("Limpar" / "Ver N vinhos").
- Alvos de toque ≥ 44×44 px; espaço ≥ 8 px entre alvos.
- Listas com carregamento progressivo ("Carregar mais", não rolagem infinita, para preservar o rodapé e o botão voltar).
- Imagem da página do vinho no topo (não sticky), seguida do nome.
- Sem hover como única forma de revelar conteúdo.
- Respeitar `safe-area-inset-*` (iPhone).
- Gestos: arrastar para fechar o bottom sheet é um **atalho**, não a única forma (sempre há botão "Fechar"; WCAG 2.5.7).

---

## 13. Tokens Tailwind v4 (rascunho para a Fase 1)

> **Implementado em `src/styles/globals.css` (F1-04), que passa a ser a fonte da verdade.** Diferenças em relação ao rascunho abaixo: as paletas, raios, sombras, easings e tamanhos de texto padrão do Tailwind foram zerados (`--color-*: initial` etc.), então só os tokens do Vinum existem; a variante `dark:` cobre tanto `data-theme="dark"` quanto a preferência do sistema; as durações ficam em `:root` (uso: `duration-(--duration-fast)`); a escala tipográfica virou tokens `--text-*` (classes `text-display`, `text-h1`… `text-overline`, esta junto com `uppercase`). Página interna de conferência: `/dev/design-system` (só em desenvolvimento). Tokens acrescentados depois: `--color-scrim` (fundo escurecido de diálogos: claro `rgb(28 28 31 / 0.45)`, escuro `rgb(8 8 10 / 0.7)`), contêineres `max-w-content`/`max-w-wide`/`max-w-lead` e as animações `animate-dialog-*`, `animate-sheet-*`, `animate-pop-*`, `animate-accordion-*` (ANIMATIONS.md A07, A08, A11).

```css
/* src/styles/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  --font-serif: var(--font-newsreader), ui-serif, Georgia, serif;
  --font-sans: var(--font-hanken), ui-sans-serif, system-ui, sans-serif;

  --color-bg: #F5F4F0;
  --color-surface: #FBFAF8;
  --color-surface-raised: #FBFAF8;
  --color-sunken: #ECEAE4;
  --color-text: #1C1C1F;
  --color-text-muted: #4F4F55;
  --color-text-subtle: #66666C;
  --color-accent: #6B1D2F;
  --color-accent-hover: #561626;
  --color-on-accent: #F5F4F0;
  --color-accent-soft: #F3E6E9;
  --color-detail: #7E6430;
  --color-border: #D9D6CE;
  --color-border-strong: #85827A;
  --color-success: #2F6B45;
  --color-warning: #80530A;
  --color-danger: #9E2A2A;
  --color-info: #2D5B87;

  --radius-media: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  --shadow-sm: 0 1px 2px rgb(28 28 31 / 0.06);
  --shadow-md: 0 8px 24px -8px rgb(28 28 31 / 0.14);
  --shadow-lg: 0 24px 48px -16px rgb(28 28 31 / 0.22);

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}

/* Tema escuro: sistema (sem escolha manual) ou escolha manual */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* mesmos tokens do bloco abaixo */ }
}
:root[data-theme="dark"] {
  --color-bg: #141416;
  --color-surface: #1C1C1F;
  --color-surface-raised: #242428;
  --color-sunken: #0F0F11;
  --color-text: #EDEBE6;
  --color-text-muted: #B8B6B0;
  --color-text-subtle: #9A9893;
  --color-accent: #DB909F;
  --color-accent-hover: #E7AEB9;
  --color-on-accent: #141416;
  --color-accent-soft: #3A2429;
  --color-detail: #C9AB72;
  --color-border: #34343A;
  --color-border-strong: #6E6E76;
  --color-success: #7CC194;
  --color-warning: #E0B25E;
  --color-danger: #EE8A8A;
  --color-info: #8DB7E0;
}
```

(A escala tipográfica fluida entra como utilitários `@utility text-display { … }` etc. na Fase 1.)

---

## 14. Checklist de design antes de entregar uma tela

- [ ] Um único acento; nenhuma cor fora dos tokens.
- [ ] Raios conforme §5.1; sombras só em camadas flutuantes.
- [ ] Contraste AA verificado nos dois temas.
- [ ] Rótulos de botão ≤ 3 palavras, sem quebra, sem intenção duplicada.
- [ ] No máximo 1 rótulo em caixa-alta a cada 3 seções.
- [ ] Nenhum travessão (—) nos textos da interface.
- [ ] Todos os estados (§7.1, §7.9) implementados.
- [ ] Imagens reais com crédito, ou `ImageUnavailable`.
- [ ] Layout testado em 360, 768 e 1440 px.
- [ ] Funciona com movimento reduzido e só com teclado.
