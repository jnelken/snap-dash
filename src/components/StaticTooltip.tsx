import { spacing, radius, colors } from "../lib/utils/design-tokens";
import { Box, Flex, Text } from "@radix-ui/themes";

export function StaticTooltip({
  color,
  xValue,
  yValue,
}: {
  color: string;
  xValue: string | null;
  yValue: number | null;
}) {
  const isVisible = xValue && yValue;

  const formattedDate =
    xValue &&
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(xValue));

  const formattedY = yValue && Math.round(yValue);

  return (
    <Flex
      // align="center"
      style={{
        borderRadius: radius.tooltip,
        border: `1.5px solid ${color}`,
        pointerEvents: isVisible ? "auto" : "none",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Box
        style={{
          backgroundColor: color,
          padding: `0px ${spacing[3]}px`,
        }}
      >
        <Text size="2" weight="bold" style={{ color: colors.white }}>
          {formattedDate || "-"}
        </Text>
      </Box>
      <Box
        style={{
          backgroundColor: colors.white,
          padding: `0px ${spacing[3]}px`,
          borderTopRightRadius: radius.tooltip,
          borderBottomRightRadius: radius.tooltip,
        }}
      >
        <Text size="2" weight="bold" style={{ color: colors.black }}>
          {formattedY || "-"}
        </Text>
      </Box>
    </Flex>
  );
}
