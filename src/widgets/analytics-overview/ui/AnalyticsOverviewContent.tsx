import type { AnalyticsOverview } from "@/entities/analytics/model/types";
import { DataState } from "@/shared/ui/DataState";
import { useI18n } from "@/shared/i18n/use-i18n";
import { AnalyticsJobsByCategoryChart } from "@/widgets/analytics-jobs-by-category/AnalyticsJobsByCategoryChart";
import { DashboardMechanicWorkload } from "@/widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import { DashboardOrdersTrend } from "@/widgets/dashboard-orders-trend/DashboardOrdersTrend";
import { DashboardRevenueChart } from "@/widgets/dashboard-revenue-chart/DashboardRevenueChart";
import { AnalyticsMetricsSection } from "./AnalyticsMetricsSection";

type AnalyticsOverviewContentProps = {
  isLoading: boolean;
  isError: boolean;
  data: AnalyticsOverview | undefined;
  onRetry: () => void;
};

export const AnalyticsOverviewContent = ({ isLoading, isError, data, onRetry }: AnalyticsOverviewContentProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return <DataState message={t("pages.analytics.states.loading")} />;
  }

  if (isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.analytics.states.error")}
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={onRetry}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (!data) {
    return <DataState message={t("pages.analytics.states.empty")} />;
  }

  return (
    <>
      <AnalyticsMetricsSection metrics={data.metrics} />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardRevenueChart data={data.revenue} />
        <DashboardOrdersTrend data={data.ordersPerDay} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <AnalyticsJobsByCategoryChart data={data.jobsByCategory} />
        <DashboardMechanicWorkload items={data.mechanicWorkload} />
      </div>
    </>
  );
};
