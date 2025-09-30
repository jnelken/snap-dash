import GridLayout, { WidthProvider } from "react-grid-layout";
import { BarChart } from "@/components/BarChart";
import "react-grid-layout/css/styles.css";
import { spacing } from "@/lib/utils/design-tokens";

const GridLayoutWithWidth = WidthProvider(GridLayout);

export interface ChartConfig {
  id: number;
  color: string;
}

interface DashboardGridProps {
  layout: GridLayout.Layout[];
  isResponsive: boolean;
  chartConfigs: ChartConfig[];
  onLayoutChange: (layout: GridLayout.Layout[]) => void;
}

export const DashboardGrid = ({
  layout,
  isResponsive,
  chartConfigs,
  onLayoutChange,
}: DashboardGridProps) => {
  return (
    <>
      <style>
        {`
          .react-grid-item .react-resizable-handle {
            opacity: 0;
            transition: opacity 150ms ease;
          }
          .react-grid-item:has(.drag-handle:hover) .react-resizable-handle {
            opacity: 1;
          }
        `}
      </style>
      <GridLayoutWithWidth
        className="layout"
        layout={layout}
        cols={isResponsive ? 3 : 1}
        margin={[spacing[5], spacing[5]]}
        containerPadding={[0, 0]}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms={true}
      >
        {chartConfigs.map((config) => (
          <div key={config.id.toString()}>
            <BarChart id={config.id} color={config.color} />
          </div>
        ))}
      </GridLayoutWithWidth>
    </>
  );
};
