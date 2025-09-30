/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from "react";
import { type DateRange } from "react-day-picker";
import type { Row } from "@/lib/hooks/useData";

interface DashboardContextType {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  hoveredDatum: Row | null;
  setHoveredDatum: (data: Row | null) => void;
  isShiftPressed: boolean;
  setIsShiftPressed: (isPressed: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const useDateRange = () => {
  const { dateRange, setDateRange } = useDashboard();
  return { dateRange, setDateRange };
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    // Initialize with a default 30-day range
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
      from: thirtyDaysAgo,
      to: today,
    };
  });

  const [hoveredDatum, setHoveredDatum] = useState<Row | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const value = {
    dateRange,
    setDateRange,
    hoveredDatum,
    setHoveredDatum,
    isShiftPressed,
    setIsShiftPressed,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Backward compatibility
export const DateRangeProvider = DashboardProvider;
