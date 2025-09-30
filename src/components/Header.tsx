import { Flex, Switch, Text, Button } from "@radix-ui/themes";
import { DateRangePicker } from "./DateRangePicker";
import { useDateRange } from "../lib/contexts/DateRangeContext";
import { useGridLayout } from "../lib/contexts/GridLayoutContext";
import { radius, colors } from "../lib/utils/design-tokens";
import { useMemo, useImperativeHandle, forwardRef } from "react";

interface HeaderProps {
  isResponsive: boolean;
  onResponsiveChange: (checked: boolean) => void;
}

export interface HeaderRef {
  reset: () => void;
}

// TODO update to react 19 to skip using forwardRef: https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop
export const Header = forwardRef<HeaderRef, HeaderProps>(
  ({ isResponsive, onResponsiveChange }, ref) => {
    const { dateRange, setDateRange } = useDateRange();
    const { resetLayout, isLayoutModified } = useGridLayout();

    const defaultDateRange = useMemo(() => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return {
        from: thirtyDaysAgo,
        to: today,
      };
    }, []);

    const isDateRangeModified = useMemo(() => {
      if (!dateRange?.from || !dateRange?.to) return false;

      const isSameDate = (date1: Date, date2: Date) => {
        return date1.toDateString() === date2.toDateString();
      };

      return (
        !isSameDate(dateRange.from, defaultDateRange.from) ||
        !isSameDate(dateRange.to, defaultDateRange.to)
      );
    }, [dateRange, defaultDateRange]);

    const handleDateReset = () => {
      setDateRange(defaultDateRange);
    };

    const handleLayoutReset = () => {
      resetLayout();
    };

    // NOTE: AI taught me this new trick to be explicit with ref handlers!
    useImperativeHandle(ref, () => ({
      reset: handleDateReset,
    }));

    return (
      <Flex
        align="center"
        justify="between"
        gap="4"
        p="4"
        style={{
          border: `1px solid ${colors.border.light}`,
          borderRadius: `${radius.card}px`,
          backgroundColor: colors.background.primary,
        }}
      >
        <Flex align="center" gap="3">
          <Switch
            checked={isResponsive}
            onCheckedChange={onResponsiveChange}
            size="2"
          />
          <Text size="3" weight="medium">
            Responsive
          </Text>
          {isLayoutModified && (
            <Button
              variant="soft"
              size="2"
              onClick={handleLayoutReset}
              style={{
                backgroundColor: colors.border.light,
                color: colors.text.secondary,
              }}
            >
              Reset Layout
            </Button>
          )}
        </Flex>

        <Flex align="center" gap="3">
          {isDateRangeModified ? (
            <Button
              variant="soft"
              size="2"
              onClick={handleDateReset}
              style={{
                backgroundColor: colors.border.light,
                border: `1px solid ${colors.border.light}`,
                color: colors.text.secondary,
              }}
            >
              Reset Dates <Text color="lime">[ESC]</Text>
            </Button>
          ) : (
            <Text size="1" color="gray">
              Hold <Text color="lime">[SHIFT]</Text> to select time range
            </Text>
          )}
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </Flex>
      </Flex>
    );
  },
);
