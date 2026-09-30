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
- **Data**: 2026-09-28 · **Status**: aceita (2026-09-28); **Fuse.js substituído por busca própria no ADR-026** (o restante continua valendo)

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

## ADR-022 — ESLint 9.39.5 em vez do 10
- **Contexto**: na Fase 0 foi registrado o ESLint 10.11.0, conferindo só as dependências diretas. Na instalação (F1-06), o `eslint-config-next` 16.3.6 aceita ESLint ≥ 9, mas os plugins que ele traz (`eslint-plugin-react` 7.37.5, `eslint-plugin-jsx-a11y` 6.10.2, `eslint-plugin-import` 2.32.0, todos na última versão) declaram suporte só até o 9. Com o 10, o lint quebra (`contextOrFilename.getFilename is not a function` no `eslint-plugin-react`).
- **Decisão**: fixar `eslint@9.39.5`. O ESLint 10 só funcionaria com contornos (fixar a versão do React nas configurações) e sem garantia dos plugins.
- **Consequências**: o npm avisa que a linha 9 não recebe mais suporte. O risco é baixo porque o ESLint é ferramenta de desenvolvimento e não vai para o site publicado. Reavaliar quando esses três plugins declararem suporte ao ESLint 10 (checar `npm view eslint-plugin-react peerDependencies`). Observação: o npm 11 avisa que o script de instalação do `unrs-resolver` (dependência do plugin `import`) não foi aprovado; ele não é necessário no Windows x64 (o binário nativo vem como dependência opcional) e o lint funciona sem ele, então fica sem aprovação.
- **Data**: 2026-09-28 · **Status**: aceita

## ADR-023 — Catálogo inicial aprovado
- **Contexto**: a F2-05 propôs regiões, uvas e produtores dentro dos 6 países do ADR-019, cada um com fonte oficial confirmada (`CURATION.md`).
- **Decisão**: aprovados 10 regiões (Chianti Classico, Barolo, Bordeaux, Champagne, Rioja, Rías Baixas, Napa Valley, Mendoza, Valle de Cafayate, Vale dos Vinhedos), 10 uvas (Sangiovese, Nebbiolo, Cabernet Sauvignon, Merlot, Chardonnay, Pinot Noir, Tempranillo, Albariño, Malbec, Torrontés Riojano) e 7 produtores (G.D. Vajra, Château Palmer, Louis Roederer, La Rioja Alta, Chateau Montelena, Catena Zapata e Miolo). Miolo entra com ressalva: só vinhos com ficha técnica publicada da safra. Chianti Classico fica sem produtor por enquanto.
- **Consequências**: as tarefas F2-06 a F2-08 só trabalham com estes itens. Inclusões novas exigem aprovação e atualização do `CURATION.md`.
- **Data**: 2026-09-28 · **Status**: aceita (itens 1 e 2 delegados pelo usuário; itens 3 e 4 escolhidos por ele)

## ADR-024 — Fotos das uvas do VIVC/JKI no repositório público
- **Contexto**: as uvas precisam de fotos reais e corretamente identificadas. O VIVC (JKI) tem fotos ampelográficas de cada variedade. A página geral do VIVC mostra só "© Julius Kühn-Institut", mas a janela de cada foto diz: "This photo can be reproduced. Please quote the source as indicated below". O aviso legal do VIVC não concede nem proíbe outros usos. O usuário informou que o Vinum é um projeto de estudo, sem público, e pediu que as fotos subam para o GitHub com a origem bem clara.
- **Decisão**: usar uma foto do VIVC por uva (de preferência o cacho na videira), somente as marcadas como reproduzíveis, com o crédito exato indicado pelo JKI; reduzidas a 1600 px no lado maior; versionadas em `public/images/grapes/`. Origem declarada em três lugares: `ImageCredit` no site, `public/images/CREDITOS.md` e `src/data/images.ts`. Fotos "Historical picture" (não reproduzíveis) ficam de fora.
- **Consequências**: o repositório público redistribui essas fotos; o `CREDITOS.md` declara que elas não são cobertas por licença do projeto e oferece remoção a pedido do detentor. Se o projeto um dia for publicado ou tiver uso comercial, reavaliar com o JKI. O VIVC passa a constar como fonte aprovada de imagens de uvas no `IMAGES.md`.
- **Data**: 2026-09-29 · **Status**: aceita (decisão do usuário)

## ADR-025 — Termos sensoriais das fontes reais e categoria de doçura dos espumantes (F2-09)
- **Contexto**: a F2-09 revisou a tabela de `src/lib/sensory-map.ts` contra as 12 fichas técnicas reais da F2-08. As fichas descrevem os vinhos em prosa, em inglês, francês e espanhol (ex.: "ample", "tense", "fine-grained"), e não usam termos de escala como "médio" ou "encorpado". Converter essa prosa em níveis de 1 a 5 seria uma interpretação nossa, não um fato da fonte. Os espumantes são diferentes: a categoria de doçura (brut nature, extra brut, brut…) é um termo legal de rotulagem, não uma impressão de degustação. Os servidores do EUR-Lex e do legislation.gov.uk bloquearam o acesso automático (resposta 202 sem conteúdo), então o texto oficial do Regulamento Delegado (UE) 2019/33 (anexo III), que define as faixas de açúcar de cada categoria, não pôde ser lido.
- **Decisão**:
  1. Corpo, acidez, taninos, doçura e intensidade aromática ficam **vazios** em todos os vinhos reais. A tabela sensorial não ganha termos novos.
  2. Os descritores em prosa dos produtores (aroma, boca) ficam para a **Fase 4**, quando a página do vinho for desenhada (como exibir, traduzir e citar texto de terceiros é decisão de interface e de direitos autorais).
  3. Novo campo `Wine.sparklingSweetness` (`Sourced`), só para espumantes. Guarda **apenas o termo** declarado pelo produtor (`brut-nature`, `extra-brut`, `brut`, `extra-dry`, `sec`, `demi-sec`, `doux`), com a ficha do produtor como fonte. **As faixas em g/l não entram** até o texto oficial da UE ser lido e registrado como fonte.
- **Consequências**: só o Brut Nature da Roederer tem categoria (a ficha diz "BRUT NATURE" e "DOSAGE: 0g/l"). O Collection 245 fica sem, porque a ficha informa a dosagem (7 g/l) mas não declara a categoria, e deduzir a categoria pela dosagem exigiria a regra oficial que não lemos. A interface mostra o termo como está no rótulo, sem explicar faixas. Pendência: obter o anexo III do Regulamento (UE) 2019/33 por outro caminho (download manual ou fonte nacional equivalente) antes de mostrar faixas de açúcar.
- **Data**: 2026-09-30 · **Status**: aceita (decisões delegadas pelo usuário)

## ADR-026 — Busca própria, palavra por palavra, no lugar do Fuse.js
- **Contexto**: na F3-01/F3-02 a busca foi feita com o Fuse.js (ADR-008). Com o catálogo real, o Fuse mostrou ruído: ele procura cada termo como **trecho dentro do texto**, então "tinto" achava Argentina, Mendoza e Catena Zapata ("argen**tino**" contém "tino", a uma letra de "tinto"), "malbek" achava "Barolo **Albe**" e "napa" achava "**Zapa**ta". O modo `useTokenSearch` do Fuse 7.5 separa só a consulta; cada palavra continua sendo procurada como trecho (conferido no código em `dist/fuse.mjs`), então não resolve.
- **Decisão**: substituir o Fuse por um comparador próprio em `src/lib/search/search.ts` (~150 linhas, com testes). Cada termo da consulta é comparado com cada **palavra** do documento: palavra igual, começo da palavra (quem ainda está digitando) ou grafia parecida pela distância de edição com inversão de letras (0 erro até 3 letras, 1 erro de 4 a 7, 2 erros a partir de 8; erro no começo de palavra mais longa só a partir de 6 letras). Todos os termos precisam casar; o nome vale mais que as palavras extras e o subtítulo; entre nomes, vence o mais coberto pela consulta. O `fuse.js` foi desinstalado antes de chegar ao `main`.
- **Consequências**: sem dependência de busca; resultado previsível e explicável; o mesmo código roda no servidor (`/pesquisa`) e no navegador (autocomplete, F3-03), com peso mínimo no bundle. O resto do ADR-008 continua valendo (autocomplete no primeiro foco, `/pesquisa` e filtros no servidor). A busca percorre todos os documentos a cada consulta: é instantânea com milhares de itens; se o catálogo passar de ~10 mil documentos, migrar para MiniSearch/Orama (índice pré-computado) ou um serviço (Meilisearch/Typesense), como já previsto no `ARCHITECTURE.md` §8.
- **Data**: 2026-09-30 · **Status**: aceita (decisão técnica delegada pelo usuário)

## ADR-027 — Filtros de `/vinhos` sem `nuqs`; card de vinho sem área de foto vazia
- **Contexto**: a F3-05/F3-06 previa o `nuqs` para sincronizar os filtros com a URL (ADR-008, `ARCHITECTURE.md` §2). Na implementação, a página `/vinhos` é renderizada no servidor a partir de `searchParams`, e o cliente só precisa trocar de URL quando um filtro muda. O `WineCard` previa foto da garrafa, mas nenhum vinho tem foto com licença ainda.
- **Decisão**:
  1. **Sem `nuqs`**: `lib/filters/wine-filters.ts` (funções puras, sem Zod) monta a URL (`winesHref`) e o cliente navega com `router.push` (cada filtro vira uma entrada no histórico, então "voltar" desfaz o último). A leitura da URL no servidor fica em `lib/filters/params.ts` (Zod, `server-only`); valores inexistentes nos dados são descartados.
  2. **Contagens no cliente**: o servidor manda ao navegador só `{ id, facets }` de cada vinho; o painel do celular conta "Ver N vinhos" ao vivo com as mesmas funções do servidor.
  3. **Card sem foto**: enquanto o vinho não tiver fotografia real com crédito, o `WineCard` não reserva área de imagem (uma grade de "Imagem indisponível" repetida não informa nada). Na página do vinho (Fase 4) o `ImageUnavailable` continua valendo.
  4. **`EntityCard`** passa para a Fase 4, junto das listas de uvas, regiões e produtores que o usam.
- **Consequências**: uma dependência a menos. Os filtros exigem JavaScript para mudar (as caixas são do Radix); sem JavaScript a lista filtrada pela URL e os chips de remoção funcionam. Com milhares de vinhos, os registros enviados ao navegador crescem (~100 bytes por vinho): reavaliar acima de ~5 mil vinhos (contagens vindas do servidor).
- **Data**: 2026-09-30 · **Status**: aceita (decisão técnica delegada pelo usuário)

## ADR-028 — Fotos de garrafas dos sites dos produtores sem autorização escrita (projeto de estudo)
- **Contexto**: o `IMAGES.md` §1 exigia autorização por escrito para usar fotos de sites de produtores. Garrafas de vinhos específicos quase nunca têm foto com licença livre (o Wikimedia Commons não tem as dos vinhos do catálogo). O usuário decidiu, em 2026-09-30, que por ser um projeto de estudo, sem público e sem fins comerciais, as imagens podem ser usadas e versionadas no GitHub, desde que fique bem claro que vêm de outras fontes ("não tem problema usar as imagens, apenas adicione os créditos de onde elas foram tiradas").
- **Decisão**: usar fotos de garrafas publicadas pelo **próprio produtor** no site oficial, sem autorização expressa, com: crédito ao produtor, endereço exato do arquivo como origem, licença descrita como "Direitos reservados ao produtor; reproduzida sem autorização expressa, com crédito, em projeto de estudo sem fins comerciais (ADR-028)", e registro em `public/images/CREDITOS.md`. Regras de correspondência mantidas: só fotos do vinho certo; foto de **outra safra** (rótulo com ano diferente) não entra; safra ilegível na foto é dita no texto alternativo. Nada de fotos de lojas, redes sociais ou bancos de imagem.
- **Consequências**: 8 dos 13 vinhos ganham foto. Ficam sem: Chateau Montelena Chardonnay (só existe a da safra 2023; a nossa é 2021), Louis Roederer Collection 245 e Brut Nature (as páginas não entregam imagem acessível; a foto genérica "Collection" não mostra o número), Catena Malbec e Catena Zapata Malbec Argentino (só fotos de outra safra, de ambiente ou deitadas em baixa resolução). **Se o site for publicado ou tiver uso comercial, estas fotos precisam de autorização escrita ou devem ser removidas** (rever junto com o ADR-024). Remoção imediata a pedido do detentor.
- **Data**: 2026-09-30 · **Status**: aceita (decisão do usuário)
- **Atualização (2026-09-30, pedido do usuário "tente adicionar todas as imagens")**: a busca continuou na biblioteca de mídia dos sites WordPress (`/wp-json/wp/v2/media?search=`) e **dentro das fichas técnicas em PDF** (a imagem JPEG da garrafa foi copiada do PDF, sem converter). Com isso, **os 13 vinhos têm foto**, todas da safra certa ou com a safra ilegível dita no texto alternativo (Montelena Chardonnay 2021, Collection 245 e Brut Nature 2015 das fichas da Roederer, Catena Malbec 2022 girada para ficar em pé, Catena Zapata Malbec Argentino). O mesmo tratamento vale para a **foto da vinícola** La Rioja Alta, S.A., tirada do site dela (não há foto no Commons). A **Torrontés Riojano** ganhou foto de fonte com licença livre: o relatório de variedade do INV (argentina.gob.ar, CC BY 4.0), fora do escopo deste ADR.
