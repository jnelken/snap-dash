import { XYChart, BarSeries } from "@visx/xychart";
import { ParentSize } from "@visx/responsive";
import { spacing, radius, chart } from "../lib/utils/design-tokens";
import { Flex } from "@radix-ui/themes";
import { type Row, useMockData } from "../lib/hooks/useData";
import { useDateRange, useDashboard } from "../lib/contexts/DateRangeContext";
import { HoverBar } from "./HoverBar";
import { ChartInteractionLayer } from "./ChartInteractionLayer";
import { BarChartLabel } from "./BarChartLabel";
import { useRef } from "react";

const MIN_HEIGHT = 100;

const accessors = {
  xAccessor: (d: Row) => (d ? new Date(d.x) : null),
  yAccessor: (d: Row) => d.y,
};

export const BarChart = ({ id, color }: { id: number; color: string }) => {
  // Generate unique gradient ID for this chart instance
  const gradientId = `selection-gradient-${id}`;

  const { dateRange } = useDateRange();
  const { data } = useMockData({ dateRange });
  const { hoveredDatum, setHoveredDatum, isShiftPressed, setIsShiftPressed } =
    useDashboard();

  // Ref to access the chart container, we'll find the SVG within it
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Get max height for hover bar
  const maxY = Math.max(...data.map((d) => d.y));

  const tooltipX = hoveredDatum ? hoveredDatum.x : null;
  const { y: tooltipY = null } = data.find((d) => d.x === tooltipX) || {};

  // TODO: Bars have an automatic width and will overlap when there's too little data

  return (
    <Flex
      direction="column"
      height="100%"
      width="100%"
      onKeyDown={(e) => e.key === "Shift" && setIsShiftPressed(true)}
      onKeyUp={(e) => e.key === "Shift" && setIsShiftPressed(false)}
      tabIndex={0}
      style={{ position: "relative" }}
    >
      <div
        ref={chartContainerRef}
        style={{ flexGrow: 1, minHeight: MIN_HEIGHT }}
      >
        <ParentSize>
          {({ width, height }) => (
            <XYChart
              height={Math.max(height, MIN_HEIGHT)}
              width={width}
              margin={{
                top: spacing[4],
                right: spacing[4],
                left: spacing[4],
                bottom: 0,
              }}
              xScale={{ type: "time", padding: 0.1 }}
              yScale={{ type: "linear" }}
            >
              <BarSeries
                data={data}
                dataKey="series"
                barPadding={chart.barPadding}
                radius={radius.barChart}
                radiusAll
                xAccessor={accessors.xAccessor}
                yAccessor={accessors.yAccessor}
                colorAccessor={() => color}
                onPointerMove={({ datum }) => {
                  if (!isShiftPressed) {
                    setHoveredDatum(datum);
                  }
                }}
                onPointerOut={() => {
                  if (!isShiftPressed) {
                    setHoveredDatum(null);
                  }
                }}
              />
              {!isShiftPressed && hoveredDatum && (
                <HoverBar
                  hoveredDate={new Date(hoveredDatum.x)}
                  maxY={maxY}
                  dataLength={data.length}
                />
              )}
              {hoveredDatum && (
                <ChartInteractionLayer
                  gradientId={gradientId}
                  chartContainerRef={chartContainerRef}
                  dataLength={data.length}
                />
              )}
            </XYChart>
          )}
        </ParentSize>
      </div>
      <BarChartLabel
        id={id}
        color={color}
        tooltipX={tooltipX}
        tooltipY={tooltipY}
      />
    </Flex>
  );
};
