import { useState, useCallback, type PointerEvent } from "react";
import { getChartCoordinates } from "../utils/chartCoordinates";

interface UseDragSelectionParams {
  isEnabled: boolean;
  getSvgElement: () => SVGSVGElement | null;
  marginLeft: number;
  innerWidth: number;
}

interface UseDragSelectionReturn {
  dragStart: number | null;
  dragCurrent: number | null;
  isDragging: boolean;
  resetDrag: () => void;
  handlePointerDown: (event: PointerEvent<SVGRectElement>) => void;
  handlePointerMove: (event: PointerEvent<SVGRectElement>) => void;
  handlePointerUp: (event: PointerEvent<SVGRectElement>) => void;
}

export function useDragSelection({
  isEnabled,
  getSvgElement,
  marginLeft,
  innerWidth,
}: UseDragSelectionParams): UseDragSelectionReturn {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragCurrent, setDragCurrent] = useState<number | null>(null);
  const isDragging = dragStart !== null && dragCurrent !== null;

  const resetDrag = useCallback(() => {
    setDragStart(null);
    setDragCurrent(null);
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<SVGRectElement>) => {
      if (!isEnabled) return;

      const svgElement = getSvgElement();
      if (!svgElement) return;

      const chartX = getChartCoordinates(
        event,
        svgElement,
        marginLeft,
        innerWidth,
      );

      setDragStart(chartX);
      setDragCurrent(chartX);

      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [isEnabled, getSvgElement, marginLeft, innerWidth],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<SVGRectElement>) => {
      if (dragStart === null) return;

      const svgElement = getSvgElement();
      if (!svgElement) return;

      const chartX = getChartCoordinates(
        event,
        svgElement,
        marginLeft,
        innerWidth,
      );

      setDragCurrent(chartX);
      event.preventDefault();
      event.stopPropagation();
    },
    [dragStart, getSvgElement, marginLeft, innerWidth],
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<SVGRectElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  return {
    dragStart,
    dragCurrent,
    isDragging,
    resetDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}