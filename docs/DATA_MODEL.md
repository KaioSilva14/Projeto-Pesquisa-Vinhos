# DATA_MODEL — Modelo de dados

> Versão 0.1 · Fase 0 · 2026-09-28
> Implementação: schemas Zod em `src/schemas/` (F2-01), com os tipos derivados (`z.infer`) exportados no mesmo arquivo de cada schema; dados em `src/data/`. Os schemas são estritos: campo desconhecido é erro.
> Regra de ouro: **campo sem fonte confiável não existe.**

---

## 1. Visão geral das entidades

```
Country 1───* Region (hierárquica: região → sub-região → denominação)
Region  *───* Grape            (uvas principais da região, com fonte)
Producer 1──* Winery           (um produtor pode ter várias vinícolas/propriedades)
Producer 1──* Wine
Winery  1──* Wine              (opcional: onde o vinho é elaborado)
Wine    *──* Grape             (composição, via WineGrape)
Wine    *──1 WineStyle
Wine    1──* Vintage           (dados que mudam por safra)
Wine    *──* Pairing           (sugestões com fonte)
Grape / WineStyle *──* Pairing (orientação geral com fonte)
Todas   *──* Source            (via sourceIds)
Todas   *──* ImageAsset        (via imageIds; ImageAsset.subjectId aponta de volta)
```

Relações sempre por **id** (nunca objeto duplicado). URLs usam `slug`.

---

## 2. Tipos base

```ts
/** Fonte de uma afirmação. */
type Source = {
  id: string;                    // "src-inv-mendoza-regiao"
  kind:
    | 'producer'                 // site oficial / ficha técnica do produtor
    | 'winery'
    | 'official-distributor'     // importador/distribuidor oficial
    | 'institution'              // órgão oficial, conselho regulador, instituto
    | 'specialized-database'     // ex.: VIVC, OIV
    | 'technical'                // publicação técnica/acadêmica
    | 'other';
  label: string;                 // "Ficha técnica oficial do produtor (safra 2021)"
  publisher?: string;            // "Instituto Nacional de Vitivinicultura (INV)"
  url?: string;                  // https obrigatório quando houver
  accessedAt: string;            // ISO "2026-09-28"
  reliability: 'primary' | 'secondary';
  archivedUrl?: string;          // cópia no Wayback Machine, se possível
  notes?: string;
};

/** Valor com rastreabilidade. */
type Sourced<T> = {
  value: T;
  sourceIds: [string, ...string[]]; // pelo menos 1
  notes?: string;                   // ex.: divergência entre fontes
};

/** Campos comuns a todas as entidades publicáveis. */
type EntityBase = {
  id: string;             // estável, kebab-case, nunca muda
  slug: string;           // URL; se mudar, registrar redirect
  isDemo?: true;          // só em src/data/demo/
  status: 'draft' | 'published';
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
  imageIds?: string[];    // a primeira é a principal
  sourceIds: string[];    // fontes gerais da entidade (além das por campo)
};

/** Texto próprio (resumo/história), sempre baseado em fontes. */
type EditorialText = {
  text: string;           // escrito por nós, nunca copiado
  basedOnSourceIds: [string, ...string[]];
  writtenAt: string;
};
```

---

## 3. Entidades

### 3.1 `Country`
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `id` | `string` | ✔ | Código ISO 3166-1 alfa-2 minúsculo (`it`, `fr`, `es`, `us`, `ar`, `br`) |
| `slug` | `string` | ✔ | Nome em português sem acento (`italia`, `franca`, `espanha`, `estados-unidos`, `argentina`, `brasil`) |
| `name` | `string` | ✔ | Nome em pt-BR |
| `summary` | `EditorialText` | | |
| `wikidataId` | `string` | | Ex.: `Q45`; apoio para cruzamento |
| `geo` | `{ geojsonPath: string; sourceIds: string[] }` | | Fase 9 |

### 3.2 `Region`
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `name` | `string` | ✔ | Nome oficial (idioma original) |
| `namePt` | `string` | | Forma usual em português, se houver |
| `countryId` | `string` | ✔ | |
| `parentId` | `string` | | Região-mãe (hierarquia) |
| `level` | `'region' \| 'subregion' \| 'appellation'` | ✔ | |
| `appellation` | `Sourced<{ system: string; category: string }>` | | Ex.: sistema "DOP" / categoria "DOC" — **só com fonte oficial** |
| `summary`, `history` | `EditorialText` | | |
| `climate` | `Sourced<string>` | | Descrição curta |
| `terroir` | `Sourced<string>` | | Solos, relevo, altitude |
| `mainGrapeIds` | `Sourced<string[]>` | | |
| `mainStyleIds` | `Sourced<string[]>` | | |
| `coordinates` | `Sourced<{ lat: number; lng: number }>` | | Ponto representativo |
| `geo` | `{ geojsonPath: string; sourceIds: string[] }` | | Delimitação oficial (fase 9) |
| `wikidataId` | `string` | | |

### 3.3 `Grape`
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `name` | `string` | ✔ | Nome usado no site (uso no Brasil) |
| `referenceName` | `Sourced<string>` | | Nome principal no VIVC, quando diferente do usado no site (ex.: "COT" para Malbec, "ALVARINHO" para Albariño). Acrescentado na F2-01 |
| `synonyms` | `Sourced<string[]>` | | Sinônimos por país; alimenta a busca |
| `color` | `Sourced<'tinta' \| 'branca' \| 'rosada' \| 'cinza'>` | | Cor da casca (terminologia a validar com VIVC) |
| `origin` | `Sourced<string>` | | Origem conhecida/provável (com nuance) |
| `parentage` | `Sourced<string>` | | Só se confirmado por estudo genético citado |
| `mainRegionIds` | `Sourced<string[]>` | | |
| `characteristics` | `Sourced<string>` | | Viticultura (resumo) |
| `aromaProfile` | `Sourced<string[]>` | | Descritores |
| `flavorProfile` | `Sourced<string[]>` | | |
| `styleIds` | `Sourced<string[]>` | | Estilos associados |
| `summary` | `EditorialText` | | |
| `vivcId` | `string` | | Número no VIVC |
| `wikidataId` | `string` | | |

### 3.4 `Producer`
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `name` | `string` | ✔ | Nome oficial |
| `countryId` | `string` | ✔ | |
| `regionIds` | `string[]` | | |
| `officialWebsite` | `Sourced<string>` | | URL verificada |
| `foundedYear` | `Sourced<number>` | | |
| `history` | `EditorialText` | | |
| `location` | `Sourced<{ city?: string; lat?: number; lng?: number }>` | | |
| `certifications` | `Sourced<string[]>` | | Orgânico, biodinâmico… **só com certificação citada** |
| `wikidataId` | `string` | | |

### 3.5 `Winery` (vinícola / propriedade física)
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `name` | `string` | ✔ | |
| `producerId` | `string` | ✔ | |
| `regionId` | `string` | | |
| `location` | `Sourced<{ address?: string; lat?: number; lng?: number }>` | | |
| `visitorInfo` | `Sourced<string>` | | Apenas se oficial (sem horários/preços) |
| `history` | `EditorialText` | | |

> Quando produtor e vinícola forem a mesma coisa nos dados, **não** criar `Winery` duplicada; a página `/vinicolas` só lista registros reais.

### 3.6 `WineStyle`
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `name` | `string` | ✔ | Ex.: "Espumante método tradicional", "Fortificado" |
| `type` | `WineType` | ✔ | Ver §4 |
| `description` | `EditorialText` | | |

### 3.7 `Wine` (o rótulo, estável ao longo das safras)
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `name` | `string` | ✔ | Nome do rótulo como no produtor |
| `producerId` | `string` | ✔ | |
| `wineryId` | `string` | | |
| `countryId` | `string` | ✔ | |
| `regionId` | `string` | | Região/denominação mais específica confirmada |
| `type` | `Sourced<WineType>` | ✔ | |
| `styleId` | `string` | | |
| `isNonVintage` | `Sourced<boolean>` | | Ex.: espumantes sem safra |
| `grapes` | `Sourced<WineGrape[]>` | | Composição típica (se não variar por safra) |
| `productionMethod` | `Sourced<string>` | | Fermentação, estágio, madeira… |
| `productionTags` | `Sourced<('organico' \| 'biodinamico' \| 'natural' \| 'vegano')[]>` | | **Só com certificação/declaração oficial** |
| `summary` | `EditorialText` | | |
| `history` | `EditorialText` | | |
| `sensory` | `SensoryProfile` | | Ver §5 |
| `sparklingSweetness` | `Sourced<'brut-nature' \| 'extra-brut' \| 'brut' \| 'extra-dry' \| 'sec' \| 'demi-sec' \| 'doux'>` | | **Só espumantes.** Termo declarado pelo produtor; sem faixas em g/l até o texto oficial da UE ser lido (ADR-025) |
| `aromaNotes` | `Sourced<string[]>` | | Descritores do produtor |
| `flavorNotes` | `Sourced<string[]>` | | |
| `servingTemperature` | `Sourced<{ minC: number; maxC: number }>` | | |
| `agingPotential` | `Sourced<string>` | | Texto da fonte ("até 10 anos") — só fonte confiável |
| `pairingIds` | `Sourced<string[]>` | | |
| `volumeMl` | `Sourced<number[]>` | | Formatos (750, 1500…) |
| `officialPageUrl` | `Sourced<string>` | | |

### 3.8 `WineGrape` (composição)
```ts
type WineGrape = {
  grapeId: string;
  percentage?: number;   // SÓ se a fonte informar; senão, omitido
  isMain?: boolean;      // só se a fonte indicar "principal"/"majoritária" ou % for a maior
};
```
Validação: soma dos percentuais ≤ 101 (tolerância de arredondamento). Se todas as uvas listadas têm percentual e a soma fica abaixo de 99%, a `notes` da composição é obrigatória e explica o que completa os 100% (ex.: uva ainda fora do catálogo). Sem nota, a soma baixa é tratada como erro de digitação (ajuste da F2-08).

### 3.9 `Vintage` (dados que mudam por safra)
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `id` | `string` | ✔ | `{wineId}-{year}` |
| `wineId` | `string` | ✔ | |
| `year` | `number` | ✔ | Validação: 1800 ≤ ano ≤ ano atual |
| `alcoholPercent` | `Sourced<number>` | | **Só confirmado** (ficha técnica/rótulo) |
| `grapes` | `Sourced<WineGrape[]>` | | Composição desta safra (sobrepõe a do `Wine`) |
| `residualSugarGL` | `Sourced<number>` | | |
| `totalAcidityGL` | `Sourced<number>` | | |
| `ph` | `Sourced<number>` | | |
| `aging` | `Sourced<string>` | | Estágio desta safra |
| `technicalSheetUrl` | `Sourced<string>` | | |
| `notes` | `EditorialText` | | Condições da safra (com fonte) |

> **Prêmios e notas de críticos: fora do modelo na v1.** Só entrariam no futuro com fonte primária verificável e decisão registrada em ADR.

### 3.10 `Pairing`
| Campo | Tipo | Obrig. | Observação |
|---|---|---|---|
| `category` | `'carnes' \| 'aves' \| 'peixes-e-frutos-do-mar' \| 'massas' \| 'queijos' \| 'vegetarianos' \| 'sobremesas' \| 'culinarias'` | ✔ | |
| `name` | `string` | ✔ | Prato/ingrediente ("Queijos de massa dura") |
| `cuisine` | `string` | | Ex.: "Culinária italiana" |
| `guidance` | `EditorialText` | | Sempre como orientação |
| `relatedGrapeIds` | `Sourced<string[]>` | | |
| `relatedStyleIds` | `Sourced<string[]>` | | |

### 3.11 `ImageAsset`
Conforme `CLAUDE.md` §9, com extensões:
```ts
type ImageAsset = {
  id: string;
  src: string;                 // caminho local: /images/grapes/malbec-01.avif
  alt: string;                 // descritivo, pt-BR
  width: number; height: number;
  credit: string;              // autor/detentor
  license: string;             // "CC BY-SA 4.0" | "Uso autorizado pelo produtor" | ...
  licenseUrl?: string;         // link para o texto da licença
  sourceUrl: string;           // página de origem verificável
  subjectType: 'wine' | 'producer' | 'winery' | 'region' | 'grape' | 'ambient';
  subjectId?: string;          // obrigatório exceto para 'ambient'
  isIllustrative?: true;       // obrigatório true para 'ambient'
  focalPoint?: { x: number; y: number }; // 0–1
  blurDataURL?: string;
  authorizationRef?: string;   // referência à autorização por escrito (quando não for licença livre)
  modified?: string;           // "recortada", "cor ajustada" (exigido por licenças CC BY-SA)
  accessedAt: string;
};
```

---

## 4. Enumerações

```ts
type WineType =
  | 'tinto' | 'branco' | 'rose' | 'espumante'
  | 'fortificado' | 'sobremesa' | 'laranja';
```
Rótulos na interface: Tinto · Branco · Rosé · Espumante · Fortificado · De sobremesa · Laranja.
"Natural" **não** é tipo: é `productionTag` e depende de declaração/certificação citada.

---

## 5. Perfil sensorial

```ts
type SensoryLevel = 1 | 2 | 3 | 4 | 5;
type SensoryAttribute = {
  level: SensoryLevel;
  sourceTerm: string;          // termo exato usado pela fonte, ex.: "encorpado"
  sourceIds: [string, ...string[]];
};
type SensoryProfile = {
  body?: SensoryAttribute;         // corpo
  acidity?: SensoryAttribute;      // acidez
  tannins?: SensoryAttribute;      // taninos (tintos)
  sweetness?: SensoryAttribute;    // doçura
  aromaIntensity?: SensoryAttribute;
};
```

**Regra anti-invenção:** o `level` só pode ser atribuído se o `sourceTerm` estiver na tabela de mapeamento abaixo (versionada em `src/lib/sensory-map.ts`). Termo fora da tabela → atributo não é preenchido (e a tabela pode ser ampliada via ADR).

| Nível | Corpo | Acidez | Taninos | Doçura |
|---|---|---|---|---|
| 1 | leve | baixa | suaves / baixos | seco |
| 2 | leve a médio | média- | médios- | meio seco / demi-sec |
| 3 | médio | média | médios | meio doce |
| 4 | médio a encorpado | média+ / viva | firmes / médios+ | doce |
| 5 | encorpado | alta | intensos / altos | muito doce |

(Revisada na F2-09, ADR-025: as fichas reais descrevem os vinhos em prosa, sem termos de escala, então a tabela não ganhou termos e os vinhos reais ficam sem perfil sensorial. Termos de espumantes (brut, extra brut…) não entram nesta tabela: ficam no campo `Wine.sparklingSweetness`, §3.7.)

---

## 6. Regras de integridade (validadas por `scripts/validate-data.ts`)

1. Todo `sourceId` referenciado existe em `sources`.
2. Todo `imageId` existe; todo `ImageAsset` com `subjectType ≠ 'ambient'` tem `subjectId` que aponta para a entidade que o usa.
3. `ImageAsset` `ambient` tem `isIllustrative: true`.
4. Toda chave estrangeira (`producerId`, `regionId`, `grapeId`…) existe.
5. `slug` único por tipo de entidade; `id` único por tipo.
6. `Region.parentId` não cria ciclo; `parentId` pertence ao mesmo país.
7. Percentuais de uvas válidos (§3.8).
8. `Vintage.year` válido; `alcoholPercent` entre 0 e 25.
9. URLs em `https://`.
10. Nenhuma entidade `published` com `isDemo: true` fora de `src/data/demo/`.
11. Nenhum `EditorialText` sem `basedOnSourceIds`.
12. `SensoryAttribute.sourceTerm` pertence à tabela de mapeamento.
13. Falha em qualquer regra → CI vermelho, build bloqueado.

---

## 7. Exemplos (DEMONSTRAÇÃO — entidades fictícias)

Os exemplos abaixo são **fictícios**, existem apenas para ilustrar o formato e ficarão em `src/data/demo/`.

```ts
// src/data/demo/sources.ts
export const demoSources: Source[] = [
  {
    id: 'src-demo-01',
    kind: 'other',
    label: 'Fonte de demonstração (não é um documento real)',
    accessedAt: '2026-09-28',
    reliability: 'secondary',
    notes: 'Usada apenas para testar a interface.',
  },
];

// src/data/demo/wines.ts
export const demoWines: Wine[] = [
  {
    id: 'vinho-exemplo-01',
    slug: 'vinho-exemplo-01-demonstracao',
    isDemo: true,
    status: 'published',
    createdAt: '2026-09-28',
    updatedAt: '2026-09-28',
    name: 'Vinho Exemplo 01 (demonstração)',
    producerId: 'produtor-exemplo-a',
    countryId: 'xx',                         // país fictício de demonstração
    type: { value: 'tinto', sourceIds: ['src-demo-01'] },
    sensory: {
      body: { level: 3, sourceTerm: 'médio', sourceIds: ['src-demo-01'] },
      // acidez, taninos, doçura ausentes: a interface simplesmente não os mostra
    },
    sourceIds: ['src-demo-01'],
    // sem imageIds → a interface mostra "Imagem indisponível"
  },
];
```

A página renderizada exibirá o selo **"Dados de demonstração"**, e o CI impede que esses dados entrem em produção.
