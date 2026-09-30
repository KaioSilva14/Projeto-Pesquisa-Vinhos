# PERFORMANCE — Orçamentos e estratégia

> Versão 0.1 · Fase 0 · 2026-09-28
> Regra de desempate: **animação × performance → performance**; **3D × performance → performance**.

---

## 1. Metas (Core Web Vitals — percentil 75, mobile)

| Métrica | Meta | Limite máximo |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2,0 s | 2,5 s |
| CLS (Cumulative Layout Shift) | ≤ 0,05 | 0,1 |
| INP (Interaction to Next Paint) | ≤ 150 ms | 200 ms |
| TTFB (páginas estáticas) | ≤ 400 ms | 800 ms |
| TBT (Lighthouse, laboratório) | ≤ 150 ms | 200 ms |
| Lighthouse Performance (mobile) | ≥ 95 | 90 |
| Lighthouse Acessibilidade / Boas práticas / SEO | ≥ 95 | 90 |

## 2. Orçamentos

| Recurso | Orçamento (gzip) |
|---|---|
| JS de primeiro carregamento, páginas de entidade | ≤ 150 KB |
| JS de primeiro carregamento, home | ≤ 170 KB |
| JS de primeiro carregamento, `/vinhos` com filtros | ≤ 180 KB |
| Chunk do autocomplete (busca + UI), sob demanda | ≤ 25 KB |
| Índice de busca (`/api/search-index`) | ≤ 150 KB na v1 (alerta no CI acima de 300 KB) |
| Chunk 3D (three + R3F + drei usado), sob demanda | ≤ 250 KB, nunca no primeiro carregamento |
| Chunk de mapa (MapLibre), sob demanda | carregado só na página de região ao entrar na viewport |
| CSS total | ≤ 35 KB |
| Fontes | 2 famílias variáveis, `latin` + `latin-ext`, ≤ 120 KB no total |
| Imagem LCP (mobile) | ≤ 200 KB |
| Requisições no primeiro carregamento (home) | ≤ 30 |

## 3. Estratégias

### 3.1 Renderização e JavaScript
- Server Components por padrão; ilhas client pequenas e folha.
- SSG para páginas de entidade (HTML pronto na CDN).
- `next/dynamic` para: autocomplete completo (carrega no foco), bottom sheet de filtros, 3D, mapas.
- Import de ícones por ícone (`@phosphor-icons/react/dist/ssr/...`), nunca o pacote inteiro.
- Evitar bibliotecas de data/utilitários grandes; usar `Intl`.
- Nenhum script de terceiros na v1.

### 3.2 Imagens
- `next/image` com `sizes` corretos, AVIF/WebP, `priority` só no LCP, dimensões explícitas (CLS zero), `placeholder="blur"` nas grandes.
- Detalhes em `IMAGES.md`.

### 3.3 Fontes
- `next/font` (self-host, `display: swap`, `adjustFontFallback` automático → CLS mínimo).
- Apenas eixos/pesos usados.

### 3.4 CSS
- Tailwind v4 gera só as classes usadas.
- Sem CSS-in-JS em runtime.

### 3.5 Cache
- Ver `ARCHITECTURE.md` §10.

### 3.6 3D (fase 8)
- Carregar **depois** do LCP e só quando a seção entra na viewport (`IntersectionObserver`, `rootMargin` 200 px).
- `frameloop="demand"` (renderiza só quando algo muda) ou pausar com `IntersectionObserver` quando fora da tela.
- `dpr={[1, 1.5]}`; `antialias` só se necessário; sombras desligadas ou "baked".
- Modelo GLB: ≤ 500 KB (meta 250 KB), compressão Draco ou Meshopt, texturas KTX2 ≤ 1024 px, via `gltf-transform`.
- **Detecção de capacidade** → versão estática (foto real) quando: `prefers-reduced-motion`, `navigator.connection.saveData`, `deviceMemory ≤ 4`, `hardwareConcurrency ≤ 4`, largura < 768 px, ou falha ao criar contexto WebGL.
- Medir Lighthouse **com e sem** 3D; se piorar a nota abaixo da meta, o 3D sai.

### 3.7 Busca
- Índice e buscador baixados só no primeiro foco/atalho; memorizados em módulo.
- Debounce 120 ms; resultados limitados (5 por grupo).
- Se o índice passar do orçamento → migrar (ver `ARCHITECTURE.md` §8).

### 3.8 Interações (INP)
- Filtros: atualização de URL com `startTransition`; listas grandes com paginação ("Carregar mais" de 24 em 24).
- Nada de trabalho pesado em handlers de clique; nada de `useState` para valores contínuos (scroll/mouse).

## 4. Como medir

| Ferramenta | Como | Quando |
|---|---|---|
| Lighthouse (Chrome DevTools) | Aba Lighthouse → Mobile → Navegação. Rodar em janela anônima, com `npm run build` + `npm run start` (nunca no `dev`) | A cada tarefa de UI relevante |
| Lighthouse CI | GitHub Actions nas rotas principais, com orçamentos acima | Fase 10 |
| `@next/bundle-analyzer` | `ANALYZE=true npm run build` → relatório dos bundles | Fase 10 e ao adicionar dependência |
| Relatório do build | `npm run build` mostra o tamanho por rota | Toda build |
| Web Vitals reais | Vercel Speed Insights (a decidir; sem cookies) | Após deploy |
| DevTools → Performance | Gravar interação de filtro/busca para investigar INP | Quando necessário |

No PowerShell, para o analisador:
```powershell
$env:ANALYZE = "true"; npm run build; Remove-Item Env:ANALYZE
```

## 5. Checklist por tarefa

- [ ] Build mostra JS por rota dentro do orçamento.
- [ ] Imagem LCP com `priority` e `sizes`; demais lazy.
- [ ] Nenhum layout shift visível (fontes, imagens, skeletons com tamanho reservado).
- [ ] Componentes client são folhas; nada de `"use client"` em layout inteiro.
- [ ] Dependência nova avaliada em peso.
- [ ] Lighthouse mobile ≥ 90 na rota alterada.
