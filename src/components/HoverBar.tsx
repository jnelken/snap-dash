import { DataContext } from "@visx/xychart";
import { Bar } from "@visx/shape";
import { radius, colors } from "../lib/utils/design-tokens";
import { calculateBarWidth } from "../lib/utils/chartCalculations";
import { useContext } from "react";

interface HoverBarProps {
  maxY: number;
  hoveredDate: Date | null;
  dataLength: number;
}

export const HoverBar = ({ hoveredDate, maxY, dataLength }: HoverBarProps) => {
  const { xScale, yScale, innerWidth, height } = useContext(DataContext);

  if (!hoveredDate || !xScale || !yScale || !innerWidth || !height)
    return null;

  const x = xScale(hoveredDate);
  const y = yScale(maxY);

  if (x == null || y == null) return null;

  const { barWidth } = calculateBarWidth(innerWidth, dataLength);
  const barHeight = height - (y as number);

  return (
    <Bar
      x={(x as number) - barWidth / 2}
      y={y as number}
      width={barWidth}
      height={barHeight}
      fill={colors.overlay.hover}
      rx={radius.barChart}
    />
  );
};
