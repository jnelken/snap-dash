import { useState } from "react";
import { Flex, Button, Popover, Text } from "@radix-ui/themes";
import {
  DayPicker,
  type DateRange,
  type DayPickerProps,
} from "react-day-picker";
import { Calendar } from "lucide-react";
import { colors, radius, spacing } from "../lib/utils/design-tokens";
import "react-day-picker/style.css";

const TWO_MONTHS_AGO = new Date();
TWO_MONTHS_AGO.setMonth(TWO_MONTHS_AGO.getMonth() - 2);

const TODAY = new Date();

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getDateRangeDisplay = (range: DateRange | undefined): string => {
  if (!range) return "Select date range";

  if (range.from && range.to) {
    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  } else if (range.from) {
    return `${formatDate(range.from)} - ...`;
  }

  return "Select date range";
};

const DATE_PICKER_PROPS: Partial<DayPickerProps> & { mode: "range" } = {
  mode: "range",
  required: true,
  // min: 7,
  numberOfMonths: 2,
  pagedNavigation: true,
  navLayout: "around",
  showOutsideDays: true,
  disabled: { before: TWO_MONTHS_AGO, after: TODAY },
  styles: {
    root: {
      // @ts-expect-error - CSS custom properties
      "--rdp-accent-color": colors.black,
      "--rdp-accent-background-color": `${colors.black}20`,
    },
    day_button: {
      border: "none",
      borderRadius: `${radius.button}px`,
    },
  },
  modifiersStyles: {
    outside: {
      color: colors.text.tertiary,
    },
    disabled: {
      opacity: 0.4,
    },
  },
};

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <Button
          variant="outline"
          size="2"
          style={{
            justifyContent: "space-between",
            backgroundColor: colors.background.primary,
            borderColor: colors.border.light,
            borderRadius: `${radius.button}px`,
            // @ts-expect-error - CSS variable override
            "--accent-9": colors.border.light,
            "--accent-a8": colors.border.light,
          }}
        >
          <Calendar size={16} style={{ color: colors.text.primary }} />
          <Text size="2" style={{ color: colors.text.primary }}>
            {getDateRangeDisplay(value)}
          </Text>
        </Button>
      </Popover.Trigger>

      <Popover.Content
        maxWidth="auto"
        style={{
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.border.light}`,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 1000,
        }}
        align="end"
        side="bottom"
        sideOffset={spacing[1]}
      >
        <Flex wrap="nowrap" gap="4">
          <DayPicker
            {...DATE_PICKER_PROPS}
            selected={value}
            onSelect={onChange}
            defaultMonth={value?.from}
          />
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
};
