// Números, datas e listas no formato brasileiro (vírgula decimal, mês por extenso).

const numberFormat = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const listFormat = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

/** 6.15 → "6,15" */
export const formatNumber = (value: number) => numberFormat.format(value);

/** 14.2 → "14,2%" */
export const formatPercent = (value: number) => `${formatNumber(value)}%`;

/** 750 → "750 ml"; 1500 → "1,5 L" */
export const formatVolume = (ml: number) =>
  ml >= 1000 ? `${formatNumber(ml / 1000)} L` : `${formatNumber(ml)} ml`;

/** { minC: 16, maxC: 18 } → "16 a 18 °C" */
export const formatTemperatureRange = ({ minC, maxC }: { minC: number; maxC: number }) =>
  minC === maxC ? `${formatNumber(minC)} °C` : `${formatNumber(minC)} a ${formatNumber(maxC)} °C`;

/** "2026-09-30" → "30 de setembro de 2026" (data sem fuso: não muda de dia) */
export function formatDate(isoDate: string): string {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);
  return dateFormat.format(new Date(Date.UTC(year, month - 1, day)));
}

/** ["Merlot", "Cabernet Sauvignon"] → "Merlot e Cabernet Sauvignon" */
export const formatList = (items: readonly string[]) => listFormat.format(items);
