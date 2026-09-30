# IMAGES — Política de imagens

> Versão 0.1 · Fase 0 · 2026-09-28
> Regra-mãe: **a imagem de X é uma foto real de X, com licença verificada. Sem isso, mostramos "Imagem indisponível".**

---

## 1. Fontes permitidas

| Fonte | Pode representar | Licença típica | Observações |
|---|---|---|---|
| **Wikimedia Commons** | Qualquer entidade, se a foto for realmente dela | CC0, CC BY, CC BY-SA, domínio público | Conferir a licença **do arquivo** (varia por imagem); registrar autor e link. Em uso (F4-08): regiões e produtores, com a descrição do arquivo confirmando o lugar; cópias reduzidas a 1600 px |
| **VIVC (Julius Kühn-Institut)** | Uvas (fotos ampelográficas: cacho, folha, broto) | "This photo can be reproduced. Please quote the source as indicated below", na janela de cada foto | Usar só fotos com esse aviso (as "Historical picture" não têm); copiar o crédito exato; ver ADR-024 |
| **Produtor / vinícola** (site, press kit) | Seus próprios vinhos, vinícolas, vinhedos | Direitos reservados → **exige autorização por escrito** | Guardar a autorização; `license: "Uso autorizado pelo produtor"` + `authorizationRef` |
| **Órgãos oficiais / institutos** | Regiões, uvas, paisagens oficiais | Varia | Ler os termos do site |
| **Fotos próprias** (tiradas pela equipe) | O que foi fotografado | Nossa | Registrar autor e data; atenção a rótulos (são marcas, mas fotografar o produto para fins informativos é prática comum; evitar uso que sugira endosso) |
| **Unsplash / Pexels** | **Somente `ambient`** (vinhedo genérico, taça, adega) | Licenças próprias das plataformas | **Nunca** para representar rótulo, vinícola, região ou uva específicos. Sempre legenda "Imagem ilustrativa" |

**Proibido**: imagens de e-commerce, redes sociais sem autorização, bancos de imagem pagos sem licença, imagens geradas por IA representando entidades reais, ilustrações/desenhos de garrafas, placeholders genéricos no produto final.

## 2. Correspondência (verificação obrigatória)

Antes de aceitar uma imagem:
- [ ] A foto mostra **exatamente** a entidade (vinho: mesmo rótulo; safra diferente só se o rótulo for idêntico e anotado em `alt`/`notes`).
- [ ] Região: a foto foi tirada **na** região (descrição/geolocalização da fonte).
- [ ] Uva: a foto mostra a variedade identificada pela fonte (fotos de uva são frequentemente mal identificadas: preferir fontes ampelográficas/institucionais).
- [ ] Licença conferida na página da fonte, na data de hoje.

## 3. Atribuição

- Todo `ImageAsset` tem `credit`, `license`, `licenseUrl`, `sourceUrl`, `accessedAt`.
- CC BY / CC BY-SA exigem: autor, título/link da fonte, licença com link e indicação de modificações (`modified`).
- Exibição: `ImageCredit` abaixo da imagem nas páginas de entidade; nos cards, via botão "Créditos"; página `/sobre#creditos` lista todos os créditos.

## 4. Formatos e tamanhos

| Item | Regra |
|---|---|
| Arquivo de origem em `public/images/` | JPEG/WebP de alta qualidade, lado maior ≥ 1600 px (garrafas ≥ 1200 px de altura) |
| Entrega | `next/image` gera AVIF/WebP automaticamente (`images.formats: ['image/avif','image/webp']`) |
| Peso alvo entregue | Hero ≤ 200 KB (mobile) · card ≤ 60 KB · miniatura ≤ 15 KB |
| Nomes de arquivo | `{subjectType}/{subjectId}-{nn}.{ext}` → `grapes/malbec-01.jpg` |
| Metadados EXIF | Remover localização/dados pessoais de fotos próprias |

### Proporções por contexto
Ver `DESIGN.md` §9 (garrafa 3:4 `contain`; região 3:2/21:9/4:5 `cover`; uva 4:3; produtor 3:2; miniatura 1:1).

### `sizes` recomendados
| Uso | `sizes` |
|---|---|
| Hero full-bleed | `100vw` |
| Imagem principal do vinho | `(min-width: 1024px) 40vw, 100vw` |
| Card em grid (1/2/3/4 colunas) | `(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw` |
| Miniatura de autocomplete | `48px` |

## 5. Texto alternativo (`alt`)

- Português, descritivo e específico: "Garrafa do [nome do vinho], rótulo frontal" · "Vinhedos em socalcos na margem do rio, região do [nome]" · "Cacho de uvas [variedade] maduras na videira".
- Não começar com "Imagem de…"/"Foto de…".
- Imagem puramente decorativa (raro): `alt=""`.
- `alt` nunca contém informação que não está confirmada (ex.: não afirmar safra se não souber).

## 6. Fallback (`ImageUnavailable`)

- Mostrado quando: entidade sem `imageIds`, arquivo ausente, erro de carregamento (`onError`).
- Mesma proporção da imagem esperada (sem CLS), fundo `--color-sunken`, ícone Phosphor + "Imagem indisponível".
- Nunca: silhueta de garrafa, foto genérica de outro vinho, desenho.
- Página `/sobre` explica por que algumas imagens estão indisponíveis (transparência).

## 7. Otimização e carregamento

- `priority` (ou `preload`) **apenas** na imagem LCP da página (hero ou foto principal do vinho).
- Demais imagens: lazy (padrão do `next/image`).
- `placeholder="blur"` com `blurDataURL` gerado no build para imagens grandes.
- `width`/`height` sempre definidos → CLS zero.
- Imagens armazenadas localmente (sem hotlink) → `remotePatterns` vazio na v1.

## 8. Modelo de pedido de autorização a produtores

> Assunto: Autorização de uso de imagens — projeto informativo Vinum
>
> Olá, equipe [produtor]. Estamos desenvolvendo o Vinum, uma plataforma **informativa e sem fins de venda** sobre vinhos, em português, que apresenta fichas técnicas com fontes oficiais. Gostaríamos de solicitar autorização para exibir as seguintes imagens do seu site/press kit nas páginas dos vinhos [lista], com crédito "[nome do produtor]" e link para o site oficial. As imagens não serão alteradas além de redimensionamento. Podemos remover a qualquer momento mediante solicitação. Agradecemos a atenção.

Guardar a resposta (e-mail) e registrar em `authorizationRef` (ex.: `auth-2026-10-produtor-x`, com o e-mail arquivado fora do repositório público).

## 9. Checklist por imagem

- [ ] Fonte permitida (§1) e correspondência verificada (§2).
- [ ] Licença conferida e registrada com link.
- [ ] Crédito, origem e `accessedAt` preenchidos.
- [ ] `alt` descritivo em português.
- [ ] Dimensões corretas e arquivo em `public/images/{tipo}/`.
- [ ] `npm run validate:data` passando.
