# DATA_SOURCES — Fontes de dados

> Versão 0.1 · Fase 0 · 2026-09-28
> Maior risco do projeto (ARCHITECTURE R1). Este documento define **de onde** os dados podem vir e **como** registrar.
> URLs listadas devem ser **conferidas no momento do uso** (sites mudam) e registradas com `accessedAt`.

---

## 1. Hierarquia de confiabilidade

Usar sempre a fonte mais alta disponível. Fonte inferior só complementa, nunca contradiz a superior.

| Nível | Tipo (`Source.kind`) | `reliability` | Exemplos de dado |
|---|---|---|---|
| 1 | Site oficial / ficha técnica do produtor ou vinícola (`producer`, `winery`) | `primary` | Nome do rótulo, uvas, %, teor alcoólico por safra, estágio, temperatura de serviço, harmonizações sugeridas |
| 2 | Distribuidor/importador oficial (`official-distributor`) | `primary` (se reproduz ficha oficial) / `secondary` | Mesmos da ficha técnica quando o produtor não publica |
| 3 | Instituições e órgãos oficiais (`institution`) | `primary` para o seu domínio | Denominações de origem, delimitações, uvas autorizadas, regras de produção, estatísticas |
| 4 | Bases especializadas/técnicas (`specialized-database`, `technical`) | `primary` para o seu domínio | Ampelografia (origem, sinônimos, genética de uvas), estudos científicos |
| 5 | Bases abertas/enciclopédias (`other`) — ex.: Wikidata | `secondary` | Identificadores, coordenadas, cruzamento. **Nunca como única fonte de um fato relevante** |

## 2. Fontes aprovadas por tipo de dado

### 2.1 Vinhos (rótulos e safras)
- **Site oficial do produtor**, fichas técnicas (PDF) por safra — fonte preferencial.
- **Press kits** oficiais.
- **Importador/distribuidor oficial** no Brasil ou no país de origem.
- Rótulo físico fotografado (quando a foto for nossa ou licenciada), para teor alcoólico e denominação.

### 2.2 Regiões, denominações e regras
| Âmbito | Fonte | Endereço (conferir) |
|---|---|---|
| União Europeia (Itália, França, Espanha) | eAmbrosia (registro oficial de indicações geográficas da UE) | ec.europa.eu/agriculture/eambrosia |
| Itália | MASAF (Ministério da Agricultura italiano) | masaf.gov.it |
| Itália | Consorzi di tutela de cada denominação (DOC/DOCG) | sites oficiais de cada consórcio |
| França | INAO (Institut national de l'origine et de la qualité) | inao.gouv.fr |
| França (dados abertos) | data.gouv.fr (conjuntos publicados pelo INAO) | data.gouv.fr |
| França | Interprofissões regionais de vinho (ex.: de cada grande região) | sites oficiais |
| Espanha | MAPA (Ministerio de Agricultura, Pesca y Alimentación) | mapa.gob.es |
| Espanha | Consejos Reguladores de cada Denominación de Origen | sites oficiais de cada conselho |
| Brasil | Embrapa Uva e Vinho | embrapa.br/uva-e-vinho |
| Brasil | INPI (registro de Indicações Geográficas) | gov.br/inpi |
| Argentina | INV (Instituto Nacional de Vitivinicultura) | argentina.gob.ar/inv |
| Estados Unidos | TTB (lista oficial de AVAs) | ttb.gov |
| Internacional | OIV (Organização Internacional da Vinha e do Vinho) | oiv.int |

### 2.3 Uvas
- **VIVC** (Vitis International Variety Catalogue, Julius Kühn-Institut) — nome principal, sinônimos, cor da baga, país de origem, parentesco. vivc.de
- **OIV** — lista internacional de variedades e sinônimos.
- Institutos nacionais (Embrapa, INV etc.) para uso regional.
- Artigos científicos (genética) citados diretamente.

### 2.4 Produtores
- Site oficial (história, fundação, localização, certificações).
- Registros oficiais de certificação (certificadoras orgânicas/biodinâmicas) para `certifications`/`productionTags`.

### 2.5 Harmonização e conceitos
- Recomendações do **próprio produtor** para um vinho específico.
- Publicações técnicas/educacionais reconhecidas para orientação geral (citar obra/edição/página quando livro).
- Sempre reescrito como orientação.

### 2.6 Geografia (fase 9)
- **Natural Earth** (domínio público) — fronteiras de países. naturalearthdata.com
- Delimitações oficiais de denominações publicadas por órgãos oficiais (ex.: dados abertos do INAO), respeitando a licença de cada conjunto.
- **OpenStreetMap** (ODbL) — base cartográfica; atribuição obrigatória "© OpenStreetMap contributors".
- **Wikidata** (CC0) — coordenadas de apoio, sempre conferidas.

### 2.7 Imagens
Ver `IMAGES.md`.

## 3. Fontes NÃO aprovadas

| Fonte | Motivo |
|---|---|
| Sites de e-commerce e marketplaces | Viés comercial, fichas copiadas/imprecisas, termos de uso |
| Apps/sites de avaliação por usuários (ex.: Vivino) e agregadores de preço (ex.: Wine-Searcher) | Dados de terceiros protegidos por termos de uso; notas de usuários fora do escopo; proibido scraping |
| Blogs e redes sociais sem autoria/fonte | Não verificável |
| Conteúdo gerado por IA sem verificação | Pode inventar |
| Wikipedia como fonte final | Pode ser usada para **achar** a fonte primária citada nela, não como fonte do fato |

## 4. Licenças e direitos

- **Fatos** (ex.: "o vinho X é elaborado com a uva Y") não são protegidos por direito autoral, mas a **redação** é: sempre reescrever.
- **Bases de dados** podem ter proteção e termos de uso: ler os termos antes de extrair dados em volume; nunca fazer scraping contra `robots.txt` ou termos.
- **Wikidata**: CC0 (livre). **OpenStreetMap**: ODbL (atribuição e share-alike para bases derivadas). **Natural Earth**: domínio público.
- Dados abertos governamentais: conferir a licença de cada conjunto (ex.: Licence Ouverte na França).
- Registrar a licença relevante em `Source.notes` quando não for óbvia.

## 5. Como registrar uma fonte

1. Criar a `Source` em `src/data/sources.ts`:
   ```ts
   {
     id: 'src-<entidade>-<descricao-curta>',
     kind: 'producer',
     label: 'Ficha técnica oficial, safra 2021',
     publisher: '<nome do produtor>',
     url: 'https://…',
     accessedAt: '2026-10-05',
     reliability: 'primary',
     archivedUrl: 'https://web.archive.org/…', // recomendado
   }
   ```
2. Referenciar em cada campo: `{ value: 13.5, sourceIds: ['src-…'] }`.
3. Salvar uma cópia arquivada quando possível (Wayback Machine), pois fichas técnicas saem do ar.
4. Commit com tipo `data:` citando as fontes no corpo.

## 6. Processo de curadoria (Fase 2 em diante)

```
Escolher entidade → Buscar fonte nível 1 → Extrair fatos (sem copiar texto)
   → Registrar Source(s) → Preencher apenas campos confirmados
   → Escrever resumo próprio (EditorialText) → Buscar imagem licenciada
   → npm run validate:data → Revisão (checklist RULES.md §6) → commit "data:"
```

- **Dupla checagem**: todo dado numérico (teor, %, safra, temperatura) é conferido duas vezes na fonte.
- **Revisão periódica**: `accessedAt` com mais de 12 meses gera aviso no script de validação.

## 7. Política para dados não confirmados

| Situação | Ação |
|---|---|
| Nenhuma fonte encontrada | Campo **não é preenchido**. A interface não mostra o campo |
| Só fonte de nível 5 | Não publicar o fato; anotar em `notes` para pesquisa futura |
| Fontes divergentes | Usar a de maior nível; registrar a divergência em `notes` |
| Dado varia por safra e a safra é desconhecida | Colocar no `Vintage` correto ou não publicar; nunca generalizar no `Wine` |
| Entidade com pouquíssimos dados | Publicar só se tiver identidade + ≥ 1 fato útil com fonte; exibir `IncompleteDataNote` |
| Dúvida | **Não publicar.** Veracidade vence sempre |

## 8. Catálogo inicial (definido pelo usuário em 2026-09-28, ADR-019)

**Países do escopo inicial: Itália, França, Espanha, Estados Unidos, Argentina e Brasil.** Nenhum outro país entra antes de novo ADR.

| País | Fontes institucionais principais (§2.2) |
|---|---|
| Itália | eAmbrosia, MASAF, consórcios de cada denominação |
| França | eAmbrosia, INAO, data.gouv.fr, interprofissões regionais |
| Espanha | eAmbrosia, MAPA, Consejos Reguladores |
| Estados Unidos | TTB (AVAs) |
| Argentina | INV |
| Brasil | Embrapa Uva e Vinho, INPI |

Começar **pequeno e verificado** para validar o processo, crescendo por lotes:
- **Lote 1**: 6 países · 1 a 2 regiões por país (6 a 12) · 8 a 12 uvas ligadas a essas regiões (fontes: VIVC + institutos);
- **Lote 2**: 1 a 2 produtores por país (6 a 12) com fichas técnicas públicas por safra;
- **Lote 3**: 2 a 4 vinhos por produtor (12 a 30 no total).

Quais regiões, uvas e produtores entram em cada lote será proposto na Fase 2 (tarefa F2-05) e só entra o que tiver fonte primária encontrada.
