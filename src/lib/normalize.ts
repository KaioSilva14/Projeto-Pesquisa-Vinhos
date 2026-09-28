// Ligaduras que a decomposição Unicode (NFD) não separa, comuns em nomes franceses e alemães
const LIGATURES: Record<string, string> = { œ: "oe", æ: "ae", ß: "ss" };

/**
 * Deixa um texto comparável para a busca: minúsculas, sem acentos, sem pontuação e com
 * espaços simples. Aplicada tanto no índice quanto no que o usuário digita (ARCHITECTURE.md §8).
 *
 * @example normalize("Côtes-du-Rhône") // "cotes du rhone"
 */
export function normalize(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[œæß]/g, (char) => LIGATURES[char] ?? char)
      // NFD separa a letra do acento ("é" vira "e" + "´"); depois removemos os acentos soltos
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      // Tudo que não é letra ou número vira espaço (hífen, apóstrofo, pontuação)
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim()
  );
}
