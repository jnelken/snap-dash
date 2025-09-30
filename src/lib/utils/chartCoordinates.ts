export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Convert pointer event coordinates to chart-relative coordinates
 */
export function getChartCoordinates(
  event: { clientX: number },
  svgElement: SVGSVGElement,
  marginLeft: number,
  innerWidth: number,
): number {
  const rect = svgElement.getBoundingClientRect();
  const relativeX = event.clientX - rect.left;
  const adjustedX = relativeX - marginLeft;
  return clamp(adjustedX, 0, innerWidth);
}