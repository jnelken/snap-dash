import { Dashboard } from "./features/dashboard/Dashboard";
import { Layout } from "./components/Layout";
import { DashboardProvider } from "./lib/contexts/DateRangeContext";
import { GridLayoutProvider } from "./lib/contexts/GridLayoutContext";

const CHART_COUNT = 9;

function App() {
  return (
    <DashboardProvider>
      <GridLayoutProvider chartCount={CHART_COUNT}>
        <Layout>
          <Dashboard />
        </Layout>
      </GridLayoutProvider>
    </DashboardProvider>
  );
}

export default App;
