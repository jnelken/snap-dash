import { chart } from "./design-tokens";

export function calculateBarWidth(
  innerWidth: number,
  dataLength: number,
): { barWidth: number; barOffset: number } {
  const barWidth = (innerWidth / dataLength) * (1 - chart.barPadding);
  const barOffset = barWidth / 2;
  return { barWidth, barOffset };
}
