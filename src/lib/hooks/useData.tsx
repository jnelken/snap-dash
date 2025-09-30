import React from "react";
import { type DateRange } from "react-day-picker";

export type Row = { x: string; y: number };

// Mock date generator that starts from today and goes backward one day with each call
const createMockDateGenerator = () => {
  let currentDate = new Date();

  return () => {
    const dateString = currentDate.toISOString().split("T")[0];
    currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // Go back one day
    return dateString;
  };
};

const generateMockData = (): Row[] => {
  const getNextDate = createMockDateGenerator();

  return Array.from({ length: 60 }, () => ({
    x: getNextDate(),
    y: Math.random() * 100 + 10,
  }));
};

export function useMockData({ dateRange }: { dateRange?: DateRange }) {
  const [data] = React.useState<Row[]>(generateMockData());

  const filteredData = React.useMemo(() => {
    return data
      .filter((row) => {
        const rowDate = new Date(row.x);
        if (!dateRange) return true;
        return (
          (dateRange.from ? rowDate >= dateRange.from : true) &&
          (dateRange.to ? rowDate <= dateRange.to : true)
        );
      })
      .sort((a, b) => a.x.localeCompare(b.x));
  }, [data, dateRange]);

  return {
    data: filteredData,
  };
}
