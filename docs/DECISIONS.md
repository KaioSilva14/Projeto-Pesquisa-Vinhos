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

## ADR-029 — Animações só com CSS, sem a biblioteca Motion (Fase 7)
- **Contexto**: o ADR-007 escolheu o Motion como biblioteca única de animação, para usar "só onde o CSS não basta". Na Fase 7, o catálogo do `ANIMATIONS.md` foi revisto com o site pronto: diálogo, painel inferior, autocomplete, pressionar e movimento reduzido já eram CSS desde a Fase 1.
- **Decisão**: **não instalar o Motion.** O que faltava foi feito com CSS e componentes pequenos, sem dependência:
  - A01 entrada de seção (home): `components/motion/Reveal.tsx` com IntersectionObserver e a animação CSS `reveal`. Seguro por padrão: o HTML do servidor vem visível (sem JavaScript nada some) e só o que está abaixo da tela ao abrir a página espera para aparecer.
  - A02 hover de card: a foto cresce 3% (`group-hover/card`; no Tailwind 4 o hover só vale em aparelhos com mouse).
  - A12 favoritar: o coração dá um pulo (`heart-pop`) só no clique.
  - A15 sombra do cabeçalho: `components/motion/ScrollSentinel.tsx` marca `<html data-scrolled>` com IntersectionObserver.
  - Movimento reduzido: o reset global de `globals.css` zera as animações, e o `Reveal` nem esconde nada.
  - **Fora, com motivo**: A09 (chips com animação de layout: os filtros trocam de página no servidor), A10 (escurecer a lista ao filtrar: a lista e os filtros são partes separadas da página), A16 (View Transitions: ainda experimental no Next 16, reavaliar depois), A17 (foto aparecendo aos poucos: sem JavaScript ela ficaria invisível, e a foto principal não pode ser animada) e A18 (perfil sensorial: nenhum vinho real tem perfil com fonte).
- **Consequências**: zero KB de biblioteca de animação no site; menos risco para o INP e o LCP. O ADR-007 continua valendo se um dia uma animação exigir JavaScript de verdade (layout animado, sequências).
- **Data**: 2026-10-01 · **Status**: aceita (decisão técnica delegada pelo usuário)

## ADR-030 — Qualidade mínima das imagens
- **Contexto**: o usuário pediu que nenhuma imagem fosse de baixa qualidade. Algumas garrafas tinham poucos pixels (Catena Malbec 160×597, Miolo Lote 43 259×783, Catena Zapata Malbec Argentino 400×600) e o navegador as esticava até ~770 px de altura na página do vinho, deixando o rótulo borrado.
- **Decisão**:
  - **Trocar as fotos pequenas** por versões maiores do mesmo vinho: Miolo Lote 43 **2012** (892×1626), tirada da ficha completa em PDF do próprio produtor, com o fundo transparente do PDF; Catena Malbec (300×1275) e Catena Zapata Malbec Argentino (300×1217), publicadas pela Winebow, importador oficial da Catena nos EUA (mesmas condições do ADR-028: crédito, projeto de estudo, retirada a pedido). A foto nova do Catena Malbec não mostra a safra no rótulo, e o texto alternativo diz isso.
  - **Tamanho mínimo** barrado pelo validador (regra 13 do `DATA_MODEL.md` §6): garrafa ≥ 950 px de altura; demais fotos com lado maior ≥ 1100 px e lado menor ≥ 700 px.
  - **Nunca esticar**: a garrafa (`contain`) é exibida no máximo no tamanho real do arquivo (`EntityImage`).
  - **Qualidade 85** na compressão do `next/image` (padrão 75).
  - **Moldura branca** para garrafas (`--color-bottle-frame`), nos dois temas: o fundo branco das fotos de produtor se funde a ela, sem editar a foto; no tema escuro, moldura e foto escurecem 12% juntas. `mix-blend-multiply` foi testado e descartado (problemas de pintura no Chromium dentro da coluna `sticky`).
- **Consequências**: foto nova precisa passar no mínimo; sem versão grande o bastante, a entidade fica com "Imagem indisponível". As fotos da Vajra (362×976) passam no mínimo e são exibidas sem esticar.
- **Data**: 2026-10-01 · **Status**: aceita (pedido do usuário; detalhes técnicos delegados)

## ADR-031 — Sugerir correção pelo GitHub, página de agradecimento e política de privacidade
- **Contexto**: o usuário pediu, entre os itens básicos de um site profissional, página de agradecimento, política de privacidade, mensagens de erro úteis e limite de caracteres. O site não tinha formulário, e o projeto não tem servidor de dados nem banco (ADR-005).
- **Decisão**: criar `/sugerir-correcao`, um formulário alinhado à regra de veracidade: página com o erro, o que está errado (20 a 1000 caracteres, com contador) e a fonte que confirma (opcional, `https://`). Ele valida no navegador, com mensagens que dizem o que fazer e um resumo dos erros que recebe o foco. Ao enviar, abre uma **issue pública já preenchida no GitHub** do projeto, numa nova aba, e leva a `/sugerir-correcao/obrigado` (noindex). **Nada é enviado ao Vinum**: sem servidor, sem banco, sem dado pessoal guardado. Se o navegador bloquear a nova aba, o formulário mostra o link. Cada lista de fontes ganhou "Encontrou um erro? Sugira uma correção", com o endereço da página preenchido. A `/privacidade` descreve exatamente o que o código faz: só os favoritos no `localStorage`, sem cookies, análise de visitas ou publicidade.
- **Consequências**: enviar exige conta no GitHub (dito na página). Se um dia houver API própria, o formulário troca o destino sem mudar a interface; a política de privacidade muda junto com qualquer novo dado guardado.
- **Data**: 2026-10-01 · **Status**: aceita (decisão técnica delegada pelo usuário)

## ADR-032 — Sem 3D no site; ícones completos e fontes dentro do orçamento
- **Contexto**: na Fase 8, uma garrafa 3D genérica (modelo próprio feito com `LatheGeometry`, `three` + `@react-three/fiber`, 236 KB comprimidos sob demanda) foi colocada sobre a foto real de vinhedo da abertura da home, só em telas largas e aparelhos capazes. O usuário viu o resultado e achou que não ficou bom: a garrafa parecia colada na paisagem. Na mesma revisão, o Lighthouse no celular deu Performance 57, porque as fontes somavam ~508 KB pré-carregados (orçamento: 120 KB).
- **Decisão**:
  - **Remover o 3D** (pedido do usuário, 2026-10-01): pacotes `three`, `@react-three/fiber` e `@types/three` desinstalados; código e testes apagados. A abertura da home fica com a foto real de Mendoza (crédito e licença), com a base dissolvida no fundo da página, só em telas ≥ 1024 px. A Fase 8 termina sem 3D; não reintroduzir sem pedido do usuário.
  - **Fontes**: só o subconjunto `latin` (cobre português, espanhol, francês e italiano, inclusive Œ e ñ), sem itálico (o site não usa) e sem o eixo de tamanho óptico da Newsreader. Pré-carregado: 90 KB.
  - **Ícones**: `favicon.ico` (16, 32 e 48 px, montado a partir do desenho de `lib/seo/brand-icon.tsx`), `icon.tsx` em 32, 96, 192 e 512 px, `apple-icon.tsx` (180 px), ícone "maskable" do Android (`/icone-maskable`) e `manifest.ts`.
- **Consequências**: menos JavaScript e nenhuma dependência de 3D; títulos um pouco mais leves (sem ajuste óptico), dentro da regra "performance > estética". O `favicon.ico` é um arquivo pronto (o Next não gera `.ico`): se o desenho do ícone mudar, gerar de novo a partir de `/icon/96`.
- **Data**: 2026-10-01 · **Status**: aceita (pedido do usuário; detalhes técnicos delegados)

## ADR-033 — Mapas com Leaflet e OpenStreetMap, carregados a pedido, com pontos de referência
- **Contexto**: a Fase 9 pedia mapas reais das regiões (ADR-015 tinha escolhido MapLibre GL). Na implementação: (1) a MapLibre 6 custaria ~450 KB comprimidos (biblioteca + worker, que precisaria ser copiado para `public/` a cada build) só para mostrar um marcador; (2) a CARTO, cogitada como mapa de fundo, passou a exigir chave; (3) nenhuma das 10 denominações tem contorno oficial fácil de obter com licença clara (só a AVA Napa Valley existe no OpenStreetMap), e os itens do Wikidata das denominações não têm coordenadas; (4) baixar o mapa automaticamente fazia as imagens do mapa virarem o maior elemento da página do país no celular (Lighthouse 80).
- **Decisão**:
  - **Leaflet 1.9.4** (~40 KB comprimidos, sem worker), substituindo a MapLibre do ADR-015. Mapa de fundo: **o mapa padrão do OpenStreetMap** (`tile.openstreetmap.org`), sem chave, com a atribuição exigida visível e um filtro de CSS que o deixa sóbrio (claro) ou escuro (tema escuro). A CSP libera só esse domínio em `img-src`.
  - **Carregado só quando a pessoa clica em "Mostrar o mapa"**: nada do OpenStreetMap é baixado sem pedido (velocidade, privacidade e respeito à política de uso dos servidores do OSM). A política de privacidade diz isso. Depois do clique, o foco vai para o mapa (setas movem, + e − aproximam).
  - **Um marcador por região, no lugar retratado na foto da região**, sem desenhar limites. Coordenadas: as gravadas na própria foto do Wikimedia Commons (Champagne, Mendoza) ou, quando a foto não tem, as do lugar que a descrição da foto cita, tiradas do OpenStreetMap (Radda in Chianti, Barolo, Bégadan, Rodezno, Castrelo/Cambados, Napa Valley AVA, Cafayate, Vale dos Vinhedos). Fontes secundárias, registradas em `src/data/sources.ts` e citadas na página. O texto diz: "O marcador indica X, lugar retratado na foto acima. É uma localização aproximada: os limites da denominação não estão desenhados", com o link "Ver no OpenStreetMap".
  - **Página de país**: um mapa com os pontos das suas regiões (clicar no marcador abre a região).
  - **Testes**: os testes E2E nunca baixam o mapa de verdade (`tests/e2e/helpers/test.ts` responde com um PNG em branco).
- **Consequências**: sem variáveis de ambiente nem chaves para mapas. Contornos oficiais (GeoJSON) ficam como melhoria futura, um a um, quando houver fonte com licença clara. Antes de publicar com tráfego alto, reavaliar o uso dos servidores do OSM (a política deles proíbe uso intensivo).
- **Data**: 2026-10-01 · **Status**: aceita (decisão técnica delegada pelo usuário); substitui a escolha de biblioteca do ADR-015

## ADR-034 — Testes E2E com fotos sem otimização e cache dos navegadores no CI
- **Contexto**: desde que a primeira foto das listas e das páginas passou a ser carregada com prioridade (PR #24), os testes E2E no GitHub Actions começaram a estourar o tempo: a navegação esperava o servidor de teste, ainda "frio", converter cada foto para AVIF, o que leva segundos por foto num computador de 2 núcleos com dois testes em paralelo. Além disso, a instalação dos navegadores do Playwright levava de 4 a 9 minutos, e o job foi cancelado ao bater no limite de 20 minutos (execução do `main` depois do PR #24).
- **Decisão**: no build dos testes E2E, o Playwright define `VINUM_E2E=1` e o `next.config.ts` liga `images.unoptimized`: as fotos são servidas como estão em `public/images`, sem conversão. Os testes verificam conteúdo, navegação e acessibilidade, que não dependem da otimização. A otimização real continua no build normal e é medida pelo Lighthouse (Fase 10). No CI, os navegadores do Playwright ficam em cache (`actions/cache`, chave pelo `package-lock.json`) e o limite do job E2E subiu para 30 minutos. O teste "Sugerir uma correção" espera o foco chegar ao resumo de erros antes de digitar.
- **Consequências**: menos testes instáveis sem remendos teste a teste; o E2E não cobre a otimização de imagens (coberta pelo Lighthouse).
- **Data**: 2026-10-01 · **Status**: aceita (decisão técnica delegada pelo usuário)

## ADR-035 — Lighthouse CI via npx, com notas mínimas e orçamentos no PR
- **Contexto**: a F10-03 pede Lighthouse automático no CI. O `@lhci/cli` 0.15.1 (versão mais nova) traz dependências com vulnerabilidades altas (`basic-ftp`, `extract-zip`, `tmp`) e faria o `npm audit --audit-level=high` do CI falhar. O pacote `@next/bundle-analyzer`, previsto no plano, só funciona com webpack; o Next 16 usa Turbopack e já tem o analisador próprio `next experimental-analyze`.
- **Decisão**: o Lighthouse CI roda **via npx** (`npm run lighthouse` → `npx --yes @lhci/cli@0.15.1 autorun`), fora do `package.json`: o projeto continua sem vulnerabilidades e a ferramenta só roda numa máquina descartável. Configuração em `lighthouserc.json`: 7 páginas principais, 3 rodadas cada (mediana), celular simulado; o PR falha se acessibilidade, boas práticas ou SEO < 95, performance < 85 (meta continua 90; a simulação oscila 85–92 nas páginas de região), CLS > 0,1 ou JavaScript > 225 KB. Relatórios ficam como arquivo do job (7 dias), sem upload público. Tamanho do código: `npm run analyze`.
- **Consequências**: um terceiro job no CI (paralelo ao E2E). Revisar a versão do `@lhci/cli` quando sair uma sem os alertas.
- **Data**: 2026-10-01 · **Status**: aceita (decisão técnica delegada pelo usuário)

## ADR-036 — Publicação na Vercel, pública e com todas as fotos
- **Contexto**: na Fase 11 o site foi publicado. As fotos de garrafas e da vinícola La Rioja Alta tiradas dos sites dos produtores e do importador (ADR-028, ADR-030) não têm autorização por escrito; o uso tinha sido aceito para um projeto de estudo **sem público**. O usuário recebeu três opções: público só com as fotos licenciadas (recomendado), fechado só para ele, ou público com todas as fotos.
- **Decisão (do usuário, 2026-10-01)**: **público, com todas as fotos**, em `https://vinum-vinhos.vercel.app` (projeto `vinum-vinhos` na Vercel, plano Hobby, ligado ao repositório do GitHub). Todo merge no `main` publica a produção; cada PR ganha uma prévia. Única variável: `NEXT_PUBLIC_SITE_URL=https://vinum-vinhos.vercel.app`. As fotos sem licença livre continuam com crédito, origem e o aviso de retirada a pedido; o projeto segue sem fins comerciais.
- **Consequências**: risco de pedido de remoção ou reclamação de direitos de imagem, assumido pelo usuário; se houver pedido, a foto sai e a página mostra "Imagem indisponível". O uso dos servidores do OpenStreetMap (ADR-033) deve ser revisto se o tráfego crescer. A conexão do Claude com a Vercel só tem permissão de leitura nesta conta: o projeto foi importado pelo usuário no site da Vercel.
- **Data**: 2026-10-01 · **Status**: aceita (decisão do usuário)

