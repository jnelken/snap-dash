/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import type { Layout } from "react-grid-layout";

interface GridLayoutContextValue {
  layout: Layout[];
  setLayout: (layout: Layout[]) => void;
  resetLayout: () => void;
  isLayoutModified: boolean;
  setChartCount: (count: number) => void;
}

const GridLayoutContext = createContext<GridLayoutContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "snap-dash-grid-layout";
const COLS = 3;

// Generate default grid layout based on number of charts
const getDefaultLayout = (chartCount: number): Layout[] => {
  return Array.from({ length: chartCount }, (_, index) => {
    const id = index + 1;
    return {
      i: id.toString(),
      x: index % COLS,
      y: Math.floor(index / COLS),
      w: 1,
      h: 1,
    };
  });
};

const loadLayoutFromStorage = (chartCount: number): Layout[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const layout = JSON.parse(stored);
      // Validate that we have layout for all charts
      if (Array.isArray(layout) && layout.length === chartCount) {
        return layout;
      }
    }
  } catch (error) {
    console.warn("Failed to load layout from localStorage:", error);
  }
  return getDefaultLayout(chartCount);
};

const saveLayoutToStorage = (layout: Layout[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch (error) {
    console.warn("Failed to save layout to localStorage:", error);
  }
};

const isLayoutModifiedCheck = (
  current: Layout[],
  defaults: Layout[]
): boolean => {
  if (current.length !== defaults.length) return true;

  return current.some((item) => {
    const defaultItem = defaults.find((d) => d.i === item.i);
    if (!defaultItem) return true;

    return (
      item.x !== defaultItem.x ||
      item.y !== defaultItem.y ||
      item.w !== defaultItem.w ||
      item.h !== defaultItem.h
    );
  });
};

export const GridLayoutProvider: React.FC<{
  children: React.ReactNode;
  chartCount: number;
}> = ({
  children,
  chartCount,
}) => {
  const [layout, setLayoutState] = useState<Layout[]>(() =>
    loadLayoutFromStorage(chartCount)
  );

  const defaultLayout = getDefaultLayout(chartCount);
  const isLayoutModified = isLayoutModifiedCheck(layout, defaultLayout);

  const setLayout = useCallback((newLayout: Layout[]) => {
    setLayoutState(newLayout);
    saveLayoutToStorage(newLayout);
  }, []);

  const resetLayout = useCallback(() => {
    const defaultLayout = getDefaultLayout(chartCount);
    setLayoutState(defaultLayout);
    saveLayoutToStorage(defaultLayout);
  }, [chartCount]);

  const setChartCount = useCallback((count: number) => {
    const newLayout = getDefaultLayout(count);
    setLayoutState(newLayout);
    saveLayoutToStorage(newLayout);
  }, []);

  const value: GridLayoutContextValue = {
    layout,
    setLayout,
    resetLayout,
    isLayoutModified,
    setChartCount,
  };

  return (
    <GridLayoutContext.Provider value={value}>
      {children}
    </GridLayoutContext.Provider>
  );
};

export const useGridLayout = (): GridLayoutContextValue => {
  const context = useContext(GridLayoutContext);
  if (context === undefined) {
    throw new Error("useGridLayout must be used within a GridLayoutProvider");
  }
  return context;
};
