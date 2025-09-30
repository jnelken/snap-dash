const MIN_SELECTION_WIDTH_PX = 2;

export const hasInvertMethod = (
  scale: unknown,
): scale is { invert: (value: number) => Date } =>
  typeof scale === "function" &&
  "invert" in scale &&
  typeof scale.invert === "function";

interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Convert pixel-based selection to date range using scale inversion
 */
export function convertSelectionToDateRange(
  selectionStart: number,
  selectionEnd: number,
  xScale: unknown,
): DateRange | null {
  const selectionWidth = Math.abs(selectionEnd - selectionStart);

  if (!hasInvertMethod(xScale) || selectionWidth < MIN_SELECTION_WIDTH_PX) {
    return null;
  }

  const from = xScale.invert(selectionStart);
  const to = xScale.invert(selectionEnd);

  if (
    !(from instanceof Date) ||
    !(to instanceof Date) ||
    isNaN(from.getTime()) ||
    isNaN(to.getTime())
  ) {
    return null;
  }

  const [rangeStart, rangeEnd] =
    from.getTime() <= to.getTime() ? [from, to] : [to, from];

  return { from: rangeStart, to: rangeEnd };
}