import { useState } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { colors, spacing, radius } from "../lib/utils/design-tokens";
import { StaticTooltip } from "./StaticTooltip";

interface BarChartLabelProps {
  id: number;
  color: string;
  tooltipX: string | null;
  tooltipY: number | null;
}

export const BarChartLabel = ({
  id,
  color,
  tooltipX,
  tooltipY,
}: BarChartLabelProps) => {
  const [isHandleHovered, setIsHandleHovered] = useState(false);

  return (
    <Flex
      justify="between"
      align="center"
      className="drag-handle"
      onMouseEnter={() => setIsHandleHovered(true)}
      onMouseLeave={() => setIsHandleHovered(false)}
      style={{
        marginTop: spacing[3],
        cursor: "move",
        backgroundColor: isHandleHovered ? colors.border.light : "transparent",
        transition: "background-color 150ms ease",
        borderRadius: radius.barChart,
      }}
    >
      <Text weight="bold" ml="3" style={{ pointerEvents: "none" }}>
        Chart {id}
      </Text>
      <StaticTooltip color={color} xValue={tooltipX} yValue={tooltipY} />
    </Flex>
  );
};
