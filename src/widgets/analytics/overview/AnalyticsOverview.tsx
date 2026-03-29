import { useAnalyticsOverviewModel } from "./hooks/use-analytics-overview-model";
import { AnalyticsHeader } from "./ui/AnalyticsHeader";
import { AnalyticsOverviewContent } from "./ui/AnalyticsOverviewContent";

export const AnalyticsOverview = () => {
  const model = useAnalyticsOverviewModel();

  return (
    <section className="grid gap-5">
      <AnalyticsHeader range={model.range} onRangeChange={model.setRange} />
      <AnalyticsOverviewContent model={model} />
    </section>
  );
};
