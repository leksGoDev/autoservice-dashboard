import { useAnalyticsPageModel } from "./model/use-analytics-page-model";
import { AnalyticsOverview } from "@/widgets/analytics-overview";

export const AnalyticsPage = () => {
  const model = useAnalyticsPageModel();

  return (
    <AnalyticsOverview
      range={model.range}
      onRangeChange={model.setRange}
      isLoading={model.isLoading}
      isError={model.isError}
      data={model.data}
      onRetry={() => model.query.refetch()}
    />
  );
};
