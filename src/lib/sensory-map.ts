import type { SensoryProfile } from "@/schemas/wine";

// Tabela de mapeamento "termo da fonte → nível 1 a 5" (DATA_MODEL.md §5).
// Regra anti-invenção: um atributo sensorial só pode ter nível se o termo EXATO usado pela
// fonte estiver aqui. Termo fora da tabela → o atributo não é preenchido. Ampliar a tabela
// exige ADR. Revisão com os termos reais das fontes: tarefa F2-09.

type SensoryKey = keyof SensoryProfile;

export const SENSORY_MAP: Record<SensoryKey, Readonly<Record<string, number>>> = {
  body: { leve: 1, "leve a médio": 2, médio: 3, "médio a encorpado": 4, encorpado: 5 },
  acidity: { baixa: 1, "média-": 2, média: 3, "média+": 4, viva: 4, alta: 5 },
  tannins: {
    suaves: 1,
    baixos: 1,
    "médios-": 2,
    médios: 3,
    firmes: 4,
    "médios+": 4,
    intensos: 5,
    altos: 5,
  },
  sweetness: { seco: 1, "meio seco": 2, "demi-sec": 2, "meio doce": 3, doce: 4, "muito doce": 5 },
  // Ainda sem termos definidos: nenhum vinho pode ter intensidade aromática até a F2-09
  aromaIntensity: {},
};

/** Nível correspondente ao termo da fonte, ou undefined se o termo não estiver na tabela. */
export function sensoryLevelFor(attribute: SensoryKey, sourceTerm: string): number | undefined {
  return SENSORY_MAP[attribute][sourceTerm.trim().toLowerCase()];
}
