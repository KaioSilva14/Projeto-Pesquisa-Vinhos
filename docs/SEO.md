# SEO — Requisitos de SEO técnico

> Versão 0.1 · Fase 0 · 2026-09-28
> Implementação via Metadata API do Next.js (`metadata` / `generateMetadata`), `sitemap.ts`, `robots.ts`, `opengraph-image`.

---

## 1. URLs

| Tipo | Padrão | Exemplo |
|---|---|---|
| Vinho | `/vinhos/[slug]` | `/vinhos/nome-do-vinho` |
| Uva | `/uvas/[slug]` | `/uvas/malbec` |
| Região | `/regioes/[slug]` | `/regioes/mendoza` |
| País | `/paises/[slug]` | `/paises/argentina` |
| Produtor | `/produtores/[slug]` | |
| Vinícola | `/vinicolas/[slug]` | |
| Harmonização | `/harmonizacoes/[slug]` | `/harmonizacoes/queijos` |
| Listas | `/vinhos`, `/uvas`, `/regioes`, `/paises`, `/produtores`, `/vinicolas`, `/harmonizacoes` | |
| Outras | `/`, `/pesquisa`, `/explorar`, `/favoritos`, `/sobre` | |

Regras: minúsculas, sem acento, hífen como separador, sem barra final, slugs estáveis. Slug alterado → redirect 308 em `next.config` (`redirects()`).

## 2. Metadata por tipo de página

`title.template`: `"%s | Vinum"` · `title.default`: `"Vinum: pesquise e descubra vinhos"`.

| Página | `title` | `description` (≤ 155 caracteres, gerada dos dados reais) | Indexar? |
|---|---|---|---|
| Home | default | Proposta do site | ✔ |
| Vinho | `{nome} ({produtor})` | "{Tipo} de {região}, {país}, elaborado com {uvas}. Ficha técnica, perfil e fontes." (só partes existentes) | ✔ |
| Uva | `{nome}: uva, origem e vinhos` | Resumo próprio truncado | ✔ |
| Região | `{nome}, {país}: região vinícola` | Resumo | ✔ |
| País | `Vinhos {da/do/dos} {país}` ("Vinhos da Itália", `lib/places/grammar.ts`) | Resumo (sem resumo: regiões, produtores e vinhos do catálogo) | ✔ |
| Produtor | `{nome}: produtor em {região}` | Resumo | ✔ |
| Listas | `Vinhos`, `Uvas`… | Descrição fixa | ✔ |
| `/vinhos?filtros` | Conforme filtros | | ✘ `noindex, follow` + canonical para `/vinhos` |
| `/pesquisa` | `Pesquisa: {q}` | | ✘ `noindex, follow` |
| `/favoritos` | `Favoritos` | | ✘ `noindex` (conteúdo pessoal) |
| 404 | `Página não encontrada` | | ✘ |
| Entidade demo | | | ✘ `noindex` (e nunca em produção) |

Helper único `src/lib/seo.ts` monta metadata a partir da entidade para evitar duplicação.

## 3. Canonical

- `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)`.
- Toda página define `alternates.canonical` (caminho sem parâmetros).
- Páginas filtradas/pesquisa apontam o canonical para a lista base.
- `hreflang`: apenas `pt-BR` na v1 (`<html lang="pt-BR">`).

## 4. Open Graph e Twitter/X Cards

- `openGraph`: `type` (`website` na home, `article` nas páginas de conteúdo), `title`, `description`, `url`, `siteName: "Vinum"`, `locale: "pt_BR"`, `images`.
- Imagem OG: foto real da entidade **se a licença permitir esse uso** (CC permite com atribuição; autorização de produtor deve cobrir), senão imagem OG gerada (`opengraph-image.tsx`) **apenas tipográfica** (nome da entidade + marca), sem desenhar garrafa.
- `twitter`: `card: "summary_large_image"`.

## 5. Sitemap e robots

- `src/app/sitemap.ts`: todas as páginas indexáveis publicadas (exclui demo, filtros, pesquisa, favoritos), com `lastModified` = `updatedAt` da entidade.
- Acima de 50.000 URLs → `generateSitemaps` (sitemaps paginados).
- `src/app/robots.ts`: `allow: /`, `disallow: /pesquisa, /favoritos, /api/`, `sitemap: {SITE_URL}/sitemap.xml`. Em ambiente de preview: `disallow: /` inteiro.

## 6. Dados estruturados (JSON-LD)

Tipados com `schema-dts`; inseridos com `<script type="application/ld+json">` com `JSON.stringify` escapando `<` (evitar XSS).

| Página | Tipos |
|---|---|
| Todas | `WebSite` (na home) com `potentialAction` `SearchAction` → `/pesquisa?q={search_term_string}`; `Organization` (o Vinum) |
| Páginas internas | `BreadcrumbList` |
| Vinho | `WebPage` com `about` → `Product` com `name`, `brand` (produtor), `image` (se houver), `countryOfOrigin`. **Sem `offers`, sem `aggregateRating`, sem `review`** |
| Produtor | `WebPage` com `about` → `Organization` (produtor) com `url` e `sameAs` = site oficial |
| Região / País | `WebPage` com `about` → `Place` (`geo` se houver coordenada com fonte) |
| Uva / conteúdo educativo | `Article` (autor = Vinum, `datePublished`/`dateModified`) |

Observação: `Product` sem `offers`/`review` **não** gera resultado enriquecido de produto no Google, e isso é intencional: o site não vende. Validar com o Rich Results Test e aceitar avisos de "campo opcional ausente" do Search Console.

## 7. Conteúdo e HTML

- Um `<h1>` por página; hierarquia de títulos sem pular níveis.
- Conteúdo principal no HTML do servidor (SSG), não dependente de JS.
- Links internos ricos (vinho ↔ uva ↔ região ↔ produtor) com texto descritivo.
- Breadcrumbs visíveis + `BreadcrumbList`.
- Imagens com `alt` descritivo.
- Performance como fator de SEO (ver `PERFORMANCE.md`).
- Página 404 útil com busca.

## 8. Checklist por página

- [ ] `title` e `description` únicos, baseados em dados reais.
- [ ] `canonical` correto; `robots` conforme tabela §2.
- [ ] OG/Twitter com imagem permitida.
- [ ] JSON-LD válido (Rich Results Test / validator.schema.org), sem marcação de venda.
- [ ] Presente no sitemap (se indexável).
- [ ] Lighthouse SEO ≥ 90.
