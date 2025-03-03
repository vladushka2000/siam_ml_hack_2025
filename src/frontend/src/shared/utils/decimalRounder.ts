export function roundToDecimal(num: number, decimals: number): number {
  const factor = 10 ** decimals;

  return Math.round(num * factor) / factor;
}
