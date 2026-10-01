# ANIMATIONS — Catálogo de animações

> Versão 0.1 · Fase 0 · 2026-09-28
> Toda animação precisa responder: **o que ela comunica?** (hierarquia, feedback, mudança de estado ou sequência narrativa). "Fica bonito" não é resposta.

---

## 1. Princípios

1. **Curta e suave**: a maioria entre 150 e 320 ms.
2. **Só `transform` e `opacity`** (nunca `width`, `height`, `top`, `left`).
3. **CSS primeiro**; Motion (`motion/react`) só para presença (entrar/sair), layout e sequências.
4. **Uma biblioteca de animação JS**: Motion. Sem GSAP, sem Lenis (ADR-007).
5. **Nada em loop** infinito na interface (exceto skeleton shimmer, que para com movimento reduzido).
6. **Nunca animar a imagem LCP** nem atrasar a exibição do conteúdo principal.
7. **Movimento reduzido obrigatório**: versão sem deslocamento, conteúdo completo.
8. Componentes animados são folhas `"use client"` isoladas.

## 2. Tokens

| Token | Valor | Uso |
|---|---|---|
| `--duration-instant` | 100 ms | Feedback de pressionar |
| `--duration-fast` | 150 ms | Hover, mudança de cor, tooltip |
| `--duration-base` | 220 ms | Popover, dropdown, chips, acordeão |
| `--duration-slow` | 320 ms | Dialog, bottom sheet |
| `--duration-editorial` | 600 ms | Entrada de seções editoriais (home) |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas (padrão) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Movimentos que vão e voltam |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | Saídas (mais rápidas que entradas: ~70% da duração) |
| Mola Motion (layout) | `{ type: "spring", stiffness: 380, damping: 36 }` | Reordenar chips/listas |

## 3. Catálogo

| ID | Nome | Onde | Propósito | Implementação | Duração / easing | Movimento reduzido |
|---|---|---|---|---|---|---|
| A01 | Entrada de seção | Seções editoriais da home, página de região | Sequência narrativa | Motion `whileInView` (once), `opacity 0→1`, `y 16→0` | 600 ms, ease-out, stagger 60 ms, máx. 6 itens | Aparece sem animação |
| A02 | Hover de card | `WineCard`, `EntityCard` | Indica clicável | CSS: imagem `scale 1→1.03`, título muda para acento | 220 ms ease-out; só `@media (hover: hover)` | Sem escala; só cor |
| A03 | Pressionar | Botões, chips, cards | Feedback tátil | CSS `:active` `scale(0.98)` | 100 ms | Desligado |
| A04 | Foco | Todos os focáveis | Localização | Anel aparece sem animação (instantâneo) | 0 ms | Igual |
| A05 | Abrir autocomplete | `SearchCombobox` | Mudança de estado | `opacity 0→1`, `y -4→0` | 150 ms ease-out; fechar 100 ms | Só opacidade, 100 ms |
| A06 | Resultados do autocomplete | Lista de sugestões | Atualização | Sem animação por item (evita ruído ao digitar) | — | — |
| A07 | Dialog | `Dialog` | Camada nova | Overlay `opacity`; painel `opacity` + `scale 0.98→1` | 320 ms entrada / 200 ms saída | Só opacidade |
| A08 | Bottom sheet | Filtros no mobile | Camada vinda de baixo | `translateY 100%→0` | 320 ms ease-out / 220 ms saída | Só opacidade |
| A09 | Chips de filtro ativos | `ActiveFilters` | Mostra o que mudou | Motion `layout` + `AnimatePresence` (entra com `scale 0.9→1` + opacidade) | Mola (layout) | Sem layout animado |
| A10 | Lista filtrada | Resultados em `/vinhos` | Mudança de estado | Crossfade suave do grid ao trocar filtros (opacidade 1→0,6 durante `isPending`) | 150 ms | Igual (só opacidade) |
| A11 | Acordeão | FAQ, grupos de filtro no desktop | Revelar | Radix `--radix-accordion-content-height` | 220 ms ease-in-out | Instantâneo |
| A12 | Favoritar | `FavoriteButton` | Confirmação | Ícone preenche + `scale 1→1.15→1` | 220 ms | Só troca de ícone |
| A13 | Toast | Confirmações | Status transitório | `opacity` + `y 8→0`; some após 4 s (pausa no hover/foco) | 220 ms | Só opacidade |
| A14 | Skeleton | Carregamentos | Indicar progresso | Brilho deslizante em gradiente neutro | 1,6 s loop | Estático |
| A15 | Header ao rolar | `SiteHeader` | Hierarquia | Sombra aparece após 8 px de rolagem (IntersectionObserver com sentinela) | 150 ms | Igual (só sombra) |
| A16 | Transição entre páginas | Navegação | Continuidade | **Avaliar na fase 7**: View Transitions API (suporte experimental no Next/React) com crossfade de 200 ms | 200 ms | Desligado |
| A17 | Imagem carregando | `EntityImage` | Evitar "pulo" | Blur placeholder → imagem (`opacity` 0→1) | 320 ms | Sem transição |
| A18 | Perfil sensorial | `SensoryProfile` | Leitura | Segmentos aparecem em sequência ao entrar na viewport | 40 ms por segmento, total ≤ 300 ms | Estático |

> **Situação (Fase 7, ADR-029):** feitas em CSS, sem o Motion: A01 (`components/motion/Reveal.tsx`), A02, A03, A05, A07, A08, A11, A12, A14, A15 (`components/motion/ScrollSentinel.tsx`). Fora, com motivo no ADR-029: A09, A10, A16, A17, A18.

## 4. Implementação

- **CSS**: tokens de duração/easing em `globals.css`; utilitário base:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  (Transições de opacidade que devem permanecer usam classe específica fora desse reset.)
- **Motion**: `MotionConfig reducedMotion="user"` no provider client; componentes `Reveal`, `Presence` em `components/motion/`. Usar `LazyMotion` + `domAnimation` para reduzir o bundle.
- Proibido: `window.addEventListener('scroll')`, `requestAnimationFrame` alterando estado React, animações dirigidas por `useState` contínuo.

## 5. Proibido

Parallax pesado · rolagem sequestrada (scroll-jacking) · cursor customizado · texto digitando sozinho · contadores animados de números · efeitos de brilho/neon · animações em loop decorativas · marquees (no máximo 1 no site inteiro, e só se justificado) · animação que atrase a leitura.
