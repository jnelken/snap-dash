import { useRef, useEffect, useState } from "react";
import { Box } from "@radix-ui/themes";
import { type Layout } from "react-grid-layout";
import { Header, type HeaderRef } from "@/components/Header";
import { useGridLayout } from "@/lib/contexts/GridLayoutContext";
import { colors } from "@/lib/utils/design-tokens";
import { DashboardGrid } from "@/components/DashboardGrid";
import { useDashboard } from "@/lib/contexts/DateRangeContext";

const CHART_CONFIGS = [
  { id: 1, color: colors.chart.blue },
  { id: 2, color: colors.chart.blue },
  { id: 3, color: colors.chart.blue },
  { id: 4, color: colors.chart.green },
  { id: 5, color: colors.chart.green },
  { id: 6, color: colors.chart.green },
  { id: 7, color: colors.chart.red },
  { id: 8, color: colors.chart.red },
  { id: 9, color: colors.chart.red },
];

export const Dashboard = () => {
  const { layout, setLayout } = useGridLayout();
  const headerRef = useRef<HeaderRef>(null);
  const [isResponsive, setIsResponsive] = useState(true);
  const { setIsShiftPressed } = useDashboard();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        headerRef.current?.reset();
      }

      if (event.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [setIsShiftPressed]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const handleResponsiveChange = (checked: boolean) => {
    setIsResponsive(checked);

    // Redistribute layout when switching to 3-column mode
    if (checked) {
      const redistributed = layout.map((item, index) => ({
        ...item,
        x: index % 3,
        y: Math.floor(index / 3),
      }));
      setLayout(redistributed);
    } else {
      // When switching to 1-column mode, set all x to 0
      const stacked = layout.map((item, index) => ({
        ...item,
        x: 0,
        y: index,
      }));
      setLayout(stacked);
    }
  };

  return (
    <Box width={"100%"} maxWidth="1280px">
      <Header
        ref={headerRef}
        isResponsive={isResponsive}
        onResponsiveChange={handleResponsiveChange}
      />
      <DashboardGrid
        layout={layout}
        isResponsive={isResponsive}
        onLayoutChange={handleLayoutChange}
        chartConfigs={CHART_CONFIGS}
      />
    </Box>
  );
};
