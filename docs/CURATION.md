# CURATION — Proposta de catálogo inicial (F2-05)

> Versão 1.0 · 2026-09-28 · **Status: aprovada pelo usuário em 2026-09-28** (ADR-023)
> Escopo: os 6 países do ADR-019. Lotes conforme `DATA_SOURCES.md` §8.
> Nesta etapa **nenhum dado foi registrado**: só foi confirmado que existe fonte oficial acessível para cada item. Os fatos (datas, percentuais, teores, regras) serão extraídos e conferidos nas tarefas F2-06 a F2-08, depois da aprovação.
> Todas as fontes abaixo foram acessadas em **2026-09-28**.

---

## Critérios usados

1. **Região**: só entra se o órgão oficial da denominação (consórcio, conselho regulador, instituto ou regulamento publicado) estiver acessível.
2. **Uva**: só entra se tiver ficha no **VIVC** (catálogo internacional de variedades do Julius Kühn-Institut) e estiver ligada a uma região proposta.
3. **Produtor**: só entra se o **site oficial** publicar dados técnicos **por safra** (ficha técnica, PDF ou página por safra). Lojas de terceiros não contam (`DATA_SOURCES.md` §3).
4. Variedade de estilos: tintos, brancos e espumantes.

---

## Lote 1a — Regiões (10)

| País | Região | Tipo | Fonte primária confirmada | Observação |
|---|---|---|---|---|
| Itália | Chianti Classico | DOCG | [Consorzio Vino Chianti Classico](https://www.chianticlassico.com/territorio/zona-di-produzione/) | Tem páginas de zona de produção e subzonas (UGA) |
| Itália | Barolo | DOCG | [Consorzio Barolo Barbaresco Alba Langhe e Dogliani](https://www.langhevini.it/le-denominazioni-tutelate-dal-consorzio/barolo-docg/) | |
| França | Bordeaux | Região com várias AOC | [CIVB, interprofissão de Bordeaux](https://www.bordeaux.com/fr/appellations/) | Delimitações oficiais a conferir também no INAO (F2-07) |
| França | Champagne | AOC | [Comité Champagne](https://www.champagne.fr/fr/decouvrir-le-champagne/un-grand-vin-d-assemblage/appellation-champagne) | Traz o estilo espumante |
| Espanha | Rioja | DOCa | [Consejo Regulador DOCa Rioja](https://www.riojawine.com/) | Tem página de variedades autorizadas |
| Espanha | Rías Baixas | DO | [Caderno de especificações vigente (MAPA, 2024)](https://www.mapa.gob.es/dam/mapa/contenido/alimentacion/temas/calidad-agroalimentaria/2017-calidad-diferenciada/nuevo_denominaciones/pliegos-de-condiciones/pliego-condiciones-vinos/dops/rias_baixas_2024_09_30.pdf) | Substituiu o regulamento de 1997 no BOE (atualizado em 2026-10-01). Traz o estilo branco |
| Estados Unidos | Napa Valley | AVA | [27 CFR 9.23 (eCFR)](https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-9/subpart-C/section-9.23) e [lista oficial de AVAs do TTB](https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/established-avas) | Delimitação oficial no regulamento federal |
| Argentina | Mendoza | IG | [Lista oficial de IG e DOC do INV (PDF)](https://www.argentina.gob.ar/sites/default/files/i.g._y_d.o.c._de_la_republica_argentina_0.pdf) e [página de Proteção de Origem do INV](https://www.argentina.gob.ar/inv/proteccion-del-origen) | A lista também traz Luján de Cuyo (DOC) e Valle de Uco, que podem virar sub-regiões depois |
| Argentina | Valle de Cafayate | IG | Mesma lista do INV | Segundo o INV, só a expressão "Valle de Cafayate" é autorizada ("Cafayate" é marca registrada). Traz o estilo branco |
| Brasil | Vale dos Vinhedos | DO | [Embrapa Uva e Vinho, DO Vale dos Vinhedos](https://www.embrapa.br/en/indicacoes-geograficas-de-vinhos-do-brasil/ig-registrada/do-vale-dos-vinhedos) | Registro no INPI a conferir no próprio INPI (F2-07) |

## Lote 1a — Uvas (10)

Todas confirmadas no VIVC em 2026-09-28. O **nome no site** segue o uso no Brasil; o **nome de referência** do VIVC fica registrado como dado.

| Nome no site | Nome de referência (VIVC) | Nº VIVC | Cor da baga (VIVC) | Ligada a | Observação |
|---|---|---|---|---|---|
| Sangiovese | SANGIOVESE | [10680](https://www.vivc.de/index.php?r=passport%2Fview&id=10680) | tinta | Chianti Classico | |
| Nebbiolo | NEBBIOLO | [8417](https://www.vivc.de/index.php?r=passport%2Fview&id=8417) | tinta | Barolo | |
| Cabernet Sauvignon | CABERNET SAUVIGNON | [1929](https://www.vivc.de/index.php?r=passport%2Fview&id=1929) | tinta | Bordeaux, Napa Valley | |
| Merlot | MERLOT NOIR | [7657](https://www.vivc.de/index.php?r=passport%2Fview&id=7657) | tinta | Bordeaux, Vale dos Vinhedos | |
| Chardonnay | CHARDONNAY BLANC | [2455](https://www.vivc.de/index.php?r=passport%2Fview&id=2455) | branca | Champagne | |
| Pinot Noir | PINOT NOIR | [9279](https://www.vivc.de/index.php?r=passport%2Fview&id=9279) | tinta | Champagne | |
| Tempranillo | TEMPRANILLO TINTO | [12350](https://www.vivc.de/index.php?r=passport%2Fview&id=12350) | tinta | Rioja | |
| Albariño | ALVARINHO | [15689](https://www.vivc.de/index.php?r=passport%2Fview&id=15689) | branca | Rías Baixas | O VIVC registra **Portugal** como país de origem; "Albariño" é o nome oficial na Espanha |
| Malbec | COT | [2889](https://www.vivc.de/index.php?r=passport%2Fview&id=2889) | tinta | Mendoza | O VIVC registra **França** como país de origem; "Malbec" é sinônimo |
| Torrontés Riojano | TORRONTES RIOJANO | [15162](https://www.vivc.de/index.php?r=passport%2Fview&id=15162) | branca | Valle de Cafayate | O VIVC **não informa** país de origem: o campo fica vazio até haver outra fonte (INV ou estudo científico) |

A ligação "uva ↔ região" (ex.: "a Sangiovese é a uva principal do Chianti Classico") também precisa de fonte: será confirmada nos documentos de cada denominação na F2-07.

## Lote 2 — Produtores (6 confirmados + Miolo com ressalva)

| País | Região | Produtor | Dados técnicos por safra no site oficial | Situação |
|---|---|---|---|---|
| Itália | Barolo | G.D. Vajra | [Fichas em PDF por safra](https://www.gdvajra.it/uploads/public/3188_fact-sheet-2021-barolo-albe-en-1-.pdf) (ex.: Barolo Albe 2020 e 2021) | Confirmado |
| Itália | Chianti Classico | — | Fèlsina: só um pacote genérico de fichas, sem safras identificadas. Castello di Ama: não localizado | **Sem produtor por enquanto** (decisão do usuário) |
| França | Bordeaux | Château Palmer | [Página por safra](https://www.chateau-palmer.com/en/wine-library) ("millésimes") | Confirmado |
| França | Champagne | Louis Roederer | [Fichas técnicas em PDF por edição/safra](https://www.louis-roederer.com/sites/default/files/pdf/lr_tech_sheet_collection_244_en.pdf) | Confirmado |
| Espanha | Rioja | La Rioja Alta, S.A. | [Fichas em PDF por safra](https://www.riojalta.com/vinos_rioja-alta/gran-reserva-904/) (Gran Reserva 904: 1982 a 2016) | Confirmado |
| Estados Unidos | Napa Valley | Chateau Montelena | [Fichas em PDF por safra](https://montelena.com/resources/) (Cabernet Sauvignon 2016 a 2022) | Confirmado |
| Argentina | Mendoza | Catena Zapata | [Página por safra de cada vinho](https://catenazapata.com/catena-zapata-malbec-argentino-2021/) | Confirmado |
| Brasil | Vale dos Vinhedos | Miolo | [PDFs no site institucional](https://institucional.miolo.com.br/produtos/miolo-lote-43/) só para algumas safras (ex.: Lote 43 2012) | **Aprovado com ressalva**: no Lote 3 só entram vinhos com ficha técnica publicada da safra |

Rías Baixas e Valle de Cafayate entram no Lote 1 (região e uva) sem produtor por enquanto: os limites de 1 a 2 produtores por país já são cobertos pelas outras regiões.

## Lote 3 — Vinhos

Registrado na F2-08 (2026-09-30): 13 vinhos, 12 safras. Montelena (Napa Valley Cabernet Sauvignon 2018, Napa Valley Chardonnay 2021), Vajra (Barolo Albe 2021, Barolo Bricco delle Viole 2022), Palmer (Château Palmer 2022, Alter Ego 2022), Roederer (Collection 245, multissafra; Brut Nature 2015), La Rioja Alta (Gran Reserva 904 2016, Lagar de Cervera 2025 na D.O. Rías Baixas), Catena Zapata (Malbec Argentino 2021, Catena Malbec 2022) e Miolo (Lote 43 2012). Da Miolo ficaram de fora o Reserva Merlot (uvas da Campanha Meridional e ficha sem safra) e o Merlot Terroir (página sem safra).

---

## Riscos e observações

- **Pendência (F2-07)**: a ligação Torrontés Riojano ↔ Valle de Cafayate ainda não tem fonte específica. O INV associa a uva aos "Valles Calchaquíes de Salta" e à Região Noroeste inteira, não a Cafayate. Até achar fonte oficial que fale de Cafayate, a região fica sem uva principal e a uva sem região.
- **Fontes com ressalva (F2-07)**: regulamento do Chianti Classico na versão do registro do MASAF (alterações até 2014; a alteração de 2023 não foi conferida); regulamento de Rías Baixas de 1997 (versões posteriores não conferidas); dado de Napa Valley vem da associação de vinícolas (fonte secundária).

- **Brasil** é o país com menos dados técnicos públicos por safra nos sites oficiais. Alternativas: aceitar produtores com fichas de poucas safras; ou pedir as fichas diretamente aos produtores (modelo de e-mail em `IMAGES.md` §8, adaptável).
- **Imagens**: nenhuma foto foi avaliada ainda. Cada item poderá aparecer com "Imagem indisponível" até haver foto com licença verificada (F2-06 a F2-08).
- **Direitos**: fatos das fichas técnicas podem ser usados; textos nunca serão copiados (`RULES.md` §1.2).

## Decisões (2026-09-28)

| Pergunta | Decisão |
|---|---|
| 1. Regiões e uvas do Lote 1 | Aprovadas as 10 regiões e as 10 uvas (o usuário delegou a escolha; mantida a proposta) |
| 2. Produtores confirmados | Aprovados os 6 (idem). Obs.: a mensagem ao usuário dizia "7 confirmados" por erro de contagem; a lista sempre teve 6 |
| 3. Brasil | **Miolo**, com a ressalva de só entrarem vinhos com ficha técnica publicada da safra |
| 4. Chianti Classico | Região sem produtor por enquanto |

Qualquer inclusão fora desta lista precisa de nova aprovação e atualização deste documento.
