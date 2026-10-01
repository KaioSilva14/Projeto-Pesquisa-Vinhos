# PRD — Vinum (nome provisório)

> Documento de requisitos do produto. Versão 0.1 · Fase 0 · 2026-09-28
> Fonte da verdade para **o que** construir. O **como** está em `ARCHITECTURE.md` e `DESIGN.md`.

---

## 1. Visão

Ser a referência em português para **pesquisar, descobrir e entender vinhos**, com a sensação de um catálogo digital premium e de uma enciclopédia moderna, em que **cada informação exibida pode ser rastreada até uma fonte confiável**.

## 2. Problema

Quem quer aprender sobre vinhos hoje encontra:

- **sites de venda** que misturam informação e empurram compra (preço, "compre agora", avaliações de origem duvidosa);
- **conteúdo espalhado** entre sites de produtores, órgãos oficiais e blogs, muitas vezes em outros idiomas;
- **informação sem fonte** ou copiada, difícil de confiar;
- interfaces pouco agradáveis, principalmente no celular.

Não existe um lugar em português, sem viés comercial, onde a pessoa consiga navegar de um vinho → uva → região → produtor com dados verificados.

## 3. Público-alvo

Adultos (18+) interessados em vinho, do iniciante ao entusiasta, que acessam majoritariamente pelo **celular**.

### 3.1 Personas

| Persona | Perfil | Objetivo principal | Frustração atual | O que o Vinum precisa oferecer |
|---|---|---|---|---|
| **Ana, a curiosa** | 29 anos, começou a se interessar por vinho, usa o celular para tudo | Entender o básico: diferença entre uvas, o que é "corpo", que vinho combina com o jantar | Termos técnicos sem explicação; sites que querem vender | Linguagem clara, glossário, harmonizações como orientação, navegação visual |
| **Rafael, o entusiasta** | 41 anos, já conhece rótulos e regiões, gosta de comparar | Pesquisar um vinho específico, ver ficha técnica completa, descobrir parecidos | Fichas incompletas ou sem fonte; comparar exige 5 abas | Busca rápida e tolerante a erros, filtros combinados, ficha técnica com fontes, "vinhos relacionados" |
| **Lúcia, a estudante** | 34 anos, trabalha em restaurante e estuda para certificação de sommelier | Consultar regiões, denominações de origem e uvas com precisão | Informação contraditória entre fontes | Dados institucionais, referências explícitas, hierarquia país → região → sub-região |

## 4. Objetivos

1. **Confiança**: 100% das afirmações factuais sobre vinhos reais têm `Source` registrada.
2. **Busca excelente**: encontrar um vinho, uva, região ou produtor em poucos toques, mesmo com erro de digitação ou sem acento.
3. **Descoberta**: toda página leva a outra relevante (vinho → uva → região → outros vinhos).
4. **Experiência premium no celular**: rápida, legível, bonita.
5. **Base escalável**: arquitetura pronta para trocar dados locais por API/banco sem refazer a interface.

## 5. Não-objetivos (explicitamente fora)

- Loja virtual, carrinho, checkout, pagamento, preços, botão "comprar", links de afiliado.
- Avaliações ou notas de usuários; notas "Vinum".
- Conta de usuário / login (na v1).
- Recomendações geradas sem base em dados reais.
- Rede social, comentários, fórum.
- Conteúdo que incentive consumo excessivo.

## 6. Funcionalidades por prioridade

Legenda: **MVP** = necessário para o primeiro lançamento · **v1** = logo após o MVP · **Futuro** = avaliar depois.

| # | Funcionalidade | Prioridade | Observações |
|---|---|---|---|
| F01 | Busca global com autocomplete (vinho, produtor, vinícola, uva, região, país, estilo) | MVP | Tolerante a erros e acentos; `Ctrl+K` e `/`; padrão combobox acessível |
| F02 | Página de resultados com filtros combinados + ordenação | MVP | Estado na URL; chips removíveis; contagem; "limpar tudo" |
| F03 | Página do vinho (editorial) | MVP | Foto real ou "imagem indisponível"; ficha técnica; perfil sensorial só com fonte; fontes |
| F04 | Páginas de uva (lista + individual) | MVP | Vinhos relacionados |
| F05 | Páginas de região e país (lista + individual) | MVP | Hierarquia país → região → sub-região |
| F06 | Páginas de produtor (lista + individual) | MVP | Relações produtor → vinhos |
| F07 | Home editorial com storytelling | MVP | Busca em destaque |
| F08 | Favoritos locais (vinhos, produtores, regiões) | MVP | `localStorage`, sem conta |
| F09 | Harmonizações | MVP (básico) / v1 (completo) | Sempre como orientação |
| F10 | Seções de descoberta ("da mesma região", "mesma uva"…) | MVP | Calculadas pelas relações reais |
| F11 | Referências/fontes visíveis por página | MVP | Seção "Fontes" |
| F12 | Aviso de consumo responsável | MVP | Rodapé + página "Sobre" |
| F13 | Páginas de vinícola (lista + individual) | v1 | Quando houver distinção real produtor ≠ vinícola nos dados |
| F14 | Explorar (navegação visual por estilos/regiões/uvas) | v1 | |
| F15 | Glossário / conteúdo educativo | v1 | Texto próprio com fontes |
| F16 | Mapas reais de regiões | v1 | MapLibre + dados geográficos licenciados |
| F17 | Animações refinadas e transições | v1 | Sempre com movimento reduzido |
| F18 | Elemento 3D sob demanda | — | Testado e removido a pedido do usuário (ADR-032) |
| F19 | Comparar vinhos lado a lado | Futuro | |
| F20 | Conta de usuário + favoritos sincronizados | Futuro | Exige backend |
| F21 | Motor de busca dedicado (Meilisearch/Typesense) | Futuro | Só se o catálogo crescer |
| F22 | Painel de curadoria de dados (CMS) | Futuro | Para escalar a inserção de dados verificados |
| F23 | Outros idiomas | Futuro | |

## 7. Jornadas de usuário

### J1 — Encontrar um vinho específico (Rafael)
1. Abre o site no celular → vê o campo de busca em destaque.
2. Digita o nome com erro ("cabernet sauvinon") → autocomplete sugere o termo correto, agrupado por tipo (Vinhos, Uvas, Produtores…).
3. Escolhe o vinho → página do vinho com foto, ficha técnica e fontes.
4. Toca em "Da mesma região" → segue explorando.
**Sucesso**: chegou ao vinho em ≤ 3 interações após digitar.

### J2 — Aprender sobre uma uva (Ana)
1. Na home, toca em "Conheça uma uva".
2. Lista de uvas com foto real (ou estado honesto sem imagem).
3. Página da uva: origem, características, regiões, estilos, vinhos com essa uva.
4. Favorita a uva / um vinho para ver depois.
**Sucesso**: entende a uva sem precisar sair do site; encontra exemplos reais.

### J3 — Filtrar por critérios combinados (Lúcia)
1. Abre "Vinhos" → abre filtros (bottom sheet no celular).
2. Seleciona Tipo = Tinto, País = Itália, Uva = (uma uva).
3. Vê chips ativos, contagem de resultados, copia a URL e envia a um colega.
4. O colega abre a URL e vê exatamente os mesmos filtros.
**Sucesso**: filtros refletidos na URL; botão voltar funciona.

### J4 — Harmonizar com um prato (Ana)
1. Abre "Harmonizações" → escolhe "Queijos".
2. Vê estilos/uvas sugeridos **como orientação**, com fonte, e vinhos de exemplo.
**Sucesso**: recebe sugestões sem ser levada a uma compra.

### J5 — Retomar favoritos
1. Abre "Favoritos" (navegação inferior no celular).
2. Vê vinhos, produtores e regiões salvos; remove um item.
**Sucesso**: lista persiste entre visitas no mesmo navegador; se o `localStorage` falhar, o site funciona e avisa discretamente.

## 8. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | O sistema deve permitir busca textual por nome de vinho, produtor, vinícola, uva, região, país e estilo. |
| RF02 | A busca deve normalizar acentos, maiúsculas e tolerar erros de digitação. |
| RF03 | O autocomplete deve sugerir resultados agrupados por tipo de entidade enquanto o usuário digita (debounce ≤ 150 ms). |
| RF04 | A busca deve ser acionável por atalho de teclado (`/` e `Ctrl+K` / `Cmd+K`). |
| RF05 | Filtros: tipo, país, região, uva, produtor, safra, estilo, corpo, acidez, taninos, doçura, características aromáticas/gustativas. |
| RF06 | Filtros devem ser combináveis e refletidos na URL. |
| RF07 | Só devem aparecer opções de filtro que existam nos dados (sem opções vazias), com contagem por opção. |
| RF08 | Resultados devem permitir ordenação (relevância, nome A–Z, safra) e carregamento progressivo/paginação. |
| RF09 | Cada página de entidade deve ter URL amigável em português (`/vinhos/[slug]`, `/uvas/[slug]`…). |
| RF10 | A página do vinho deve exibir apenas campos com fonte; campos sem fonte não aparecem. |
| RF11 | Cada página de entidade deve listar as fontes utilizadas. |
| RF12 | Toda imagem deve exibir crédito/licença acessível; sem imagem confiável → componente "Imagem indisponível". |
| RF13 | Dados de demonstração (`isDemo: true`) devem exibir o selo "Dados de demonstração" e nunca usar nomes de rótulos reais. |
| RF14 | O usuário deve poder favoritar vinhos, produtores e regiões sem conta. |
| RF15 | Seções de descoberta devem ser calculadas a partir das relações reais entre entidades. |
| RF16 | O rodapé deve conter aviso de consumo responsável e proibição para menores de 18 anos. |
| RF17 | O site deve ter breadcrumbs em todas as páginas internas. |
| RF18 | Páginas de erro (404/500) devem oferecer caminhos úteis (busca, home). |

## 9. Requisitos não funcionais

| ID | Categoria | Requisito |
|---|---|---|
| RNF01 | Veracidade | Nenhum dado inventado; validação automática de fontes no CI (`npm run validate:data`). |
| RNF02 | Performance | Lighthouse ≥ 90 (Performance, A11y, Boas práticas, SEO) nas páginas principais, perfil mobile. LCP ≤ 2,5 s · CLS ≤ 0,1 · INP ≤ 200 ms. |
| RNF03 | Acessibilidade | WCAG 2.2 nível AA. Navegação completa por teclado. `prefers-reduced-motion` respeitado. |
| RNF04 | Responsividade | Mobile-first; funcional de 320 px a 2560 px de largura. |
| RNF05 | SEO | Metadata própria por página, sitemap, robots, canonical, Open Graph, JSON-LD sem marcação de venda. |
| RNF06 | Segurança | CSP e headers de segurança; nenhum segredo no frontend; entradas validadas com Zod. |
| RNF07 | Manutenibilidade | TypeScript `strict`; componentes ≤ ~200 linhas; lint/format/testes no CI. |
| RNF08 | Resiliência | Nenhuma tela quebra por dado ausente; estados de loading/erro/vazio em toda funcionalidade. |
| RNF09 | Privacidade | Sem rastreamento invasivo; sem cookies de terceiros na v1. |
| RNF10 | Idioma | Interface em português do Brasil (pt-BR). |

## 10. Métricas de sucesso

| Métrica | Meta | Como medir |
|---|---|---|
| Afirmações factuais com fonte | 100% | Script de validação de dados no CI |
| Imagens com crédito + licença + origem | 100% | Script de validação de dados no CI |
| Lighthouse (mobile) nas páginas principais | ≥ 90 nas 4 categorias | Lighthouse CI |
| Violações axe (sérias/críticas) | 0 | Playwright + axe |
| Tempo até primeira sugestão de busca | ≤ 300 ms após digitar (após índice carregado) | Teste E2E / medição manual |
| Buscas sem resultado | Monitorar e reduzir (após lançamento) | Analytics respeitoso à privacidade (a decidir) |
| Profundidade de navegação | ≥ 3 páginas por sessão | Analytics (a decidir) |

## 11. Critérios de aceite do MVP

- [ ] Busca com autocomplete funcionando com erro de digitação e sem acento.
- [ ] Filtros combinados com URL compartilhável; botão voltar funciona.
- [ ] Páginas de vinho, uva, região, país e produtor navegáveis entre si.
- [ ] Conjunto inicial de dados **reais e verificados** (tamanho pequeno, a definir em `TASKS.md`), 100% com fontes.
- [ ] Todas as imagens reais e licenciadas **ou** estado "Imagem indisponível".
- [ ] Favoritos persistindo no navegador.
- [ ] Home editorial publicada.
- [ ] Aviso de consumo responsável visível.
- [ ] Lighthouse ≥ 90 e 0 violações axe sérias nas páginas principais.
- [ ] `lint`, `typecheck`, testes, validação de dados e `build` passando no CI.
- [ ] Deploy na Vercel (quando o usuário autorizar).

## 12. Fora do escopo do MVP

E-commerce (qualquer forma) · contas/login · banco de dados · avaliações de usuários · comparador · CMS · motor de busca externo · múltiplos idiomas · app nativo.

## 13. Questões respondidas (2026-09-28)

| # | Questão | Resposta do usuário |
|---|---|---|
| 1 | Nome | Manter **"Vinum"** (ADR-001) |
| 2 | Referências visuais | **Não há.** Seguir a identidade definida no `DESIGN.md` |
| 3 | Verificação de idade | **Sem verificação de idade** (não é site de venda). Mantido apenas o aviso de consumo responsável 18+ no rodapé e no Sobre, exigido pelo `CLAUDE.md` §21 (ADR-012) |
| 4 | Catálogo inicial | **Itália, França, Espanha, Estados Unidos, Argentina e Brasil** (ADR-019; plano de lotes em `DATA_SOURCES.md` §8) |
| 5 | Local do projeto | **Mover para fora do OneDrive**: `C:\dev\Projeto-Vinhos` (ADR-016) |
