import { DataContext } from "@visx/xychart";
import { radius, colors } from "../lib/utils/design-tokens";
import { calculateBarWidth } from "../lib/utils/chartCalculations";
import { useDateRange, useDashboard } from "../lib/contexts/DateRangeContext";
import { useContext, useCallback, useEffect, type RefObject } from "react";
import { useDragSelection } from "../lib/hooks/useDragSelection";
import { convertSelectionToDateRange } from "../lib/utils/dateRangeSelection";

interface ChartInteractionLayerProps {
  gradientId: string;
  chartContainerRef: RefObject<HTMLDivElement>;
  dataLength: number;
}

export function ChartInteractionLayer({
  gradientId,
  chartContainerRef,
  dataLength,
}: ChartInteractionLayerProps) {
  const { setDateRange } = useDateRange();
  const { isShiftPressed } = useDashboard();
  const dataContext = useContext(DataContext);

  // Helper function to get the SVG element from the container
  const getSvgElement = useCallback((): SVGSVGElement | null => {
    if (!chartContainerRef.current) return null;
    return chartContainerRef.current.querySelector("svg");
  }, [chartContainerRef]);

  const innerWidth = dataContext?.innerWidth ?? 0;
  const innerHeight = dataContext?.innerHeight ?? 0;
  const margin = dataContext?.margin ?? {
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  };
  const totalWidth = dataContext?.width ?? 0;
  const totalHeight = dataContext?.height ?? 0;
  const xScale = dataContext?.xScale;

  const hasChartArea =
    dataContext != null && innerWidth > 0 && innerHeight > 0 && xScale != null;

  const {
    dragStart,
    dragCurrent,
    isDragging,
    resetDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDragSelection({
    isEnabled: isShiftPressed,
    getSvgElement,
    marginLeft: margin.left,
    innerWidth,
  });

  // HACK Right now, visx handles hover events, but this component handles time range selection.
  // TODO Unify our interaction layer
  useEffect(() => {
    const svgElement = getSvgElement();
    if (svgElement) {
      const transparentRect = svgElement.querySelector(
        'rect[fill="transparent"]',
      ) as SVGRectElement;

      if (transparentRect) {
        // Disable visx transparent rect when selecting, otherwise enable for tooltips
        transparentRect.style.pointerEvents = isShiftPressed ? "none" : "all";
      }
    } else {
      console.log("❌ No SVG element found to disable visx rects");
    }
  }, [getSvgElement, hasChartArea, isShiftPressed]); // Re-run when chart changes

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<SVGRectElement>) => {
      handlePointerUp(event);

      if (!isDragging || dragStart === null || dragCurrent === null) {
        resetDrag();
        return;
      }

      const selectionStart = Math.min(dragStart, dragCurrent);
      const selectionEnd = Math.max(dragStart, dragCurrent);

      const dateRange = convertSelectionToDateRange(
        selectionStart,
        selectionEnd,
        xScale,
      );

      if (dateRange) {
        setDateRange(dateRange);
      }

      resetDrag();
    },
    [
      handlePointerUp,
      isDragging,
      dragStart,
      dragCurrent,
      xScale,
      setDateRange,
      resetDrag,
    ],
  );

  const { barWidth, barOffset } = calculateBarWidth(innerWidth, dataLength);

  // Account for scale padding (xScale has padding: 0.1)
  // This padding adds space at the start/end of the scale
  const scalePadding = 0.1;
  const paddingOffset = (innerWidth * scalePadding) / 2;

  const selectionX =
    isDragging && dragStart !== null && dragCurrent !== null
      ? Math.min(dragStart, dragCurrent) + paddingOffset - barOffset
      : 0;
  const selectionWidth =
    isDragging && dragStart !== null && dragCurrent !== null
      ? Math.abs(dragCurrent - dragStart) + barWidth
      : 0;

  if (!hasChartArea || !xScale) {
    return null;
  }

  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: colors.chart.blue, stopOpacity: 0.4 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: colors.chart.blue, stopOpacity: 0.1 }}
          />
        </linearGradient>
      </defs>
      {isDragging && selectionWidth > 0 && (
        <rect
          x={selectionX}
          y={0}
          width={selectionWidth}
          height={totalHeight}
          style={{
            fill: `url(#${gradientId})`,
            stroke: colors.chart.blue,
            strokeWidth: 1.5,
            pointerEvents: "none",
          }}
          rx={radius.barChart}
          ry={radius.barChart}
        />
      )}

      <rect
        x={0}
        y={0}
        fill="none"
        width={totalWidth}
        height={totalHeight}
        style={{
          cursor: isShiftPressed
            ? isDragging
              ? "ew-resize"
              : "crosshair"
            : "default",
          pointerEvents: "all",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerLeave={handlePointerEnd}
      />
    </g>
  );
}
