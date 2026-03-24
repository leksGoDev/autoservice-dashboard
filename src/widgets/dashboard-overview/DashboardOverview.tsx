import { useDashboardOverviewModel } from "./model/use-dashboard-overview-model";
import { DashboardOverviewContent } from "./ui/DashboardOverviewContent";
import { DashboardOverviewHeader } from "./ui/DashboardOverviewHeader";

export const DashboardOverview = () => {
  const model = useDashboardOverviewModel();

  return (
    <section className="grid gap-5">
      <DashboardOverviewHeader range={model.range} onRangeChange={model.setRange} />
      <DashboardOverviewContent overviewQuery={model.overviewQuery} />
    </section>
  );
};
