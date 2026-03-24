import { DataState } from "@/shared/ui/DataState";
import { useI18n } from "@/shared/i18n/use-i18n";
import { AnalyticsJobsByCategoryChart } from "@/widgets/analytics/jobs-by-category/AnalyticsJobsByCategoryChart";
import { DashboardMechanicWorkload } from "@/widgets/dashboard/mechanic-workload/DashboardMechanicWorkload";
import { DashboardOrdersTrend } from "@/widgets/dashboard/orders-trend/DashboardOrdersTrend";
import { DashboardRevenueChart } from "@/widgets/dashboard/revenue-chart/DashboardRevenueChart";
import type { useAnalyticsOverviewModel } from "../model/use-analytics-overview-model";
import { AnalyticsMetricsSection } from "./AnalyticsMetricsSection";

type AnalyticsOverviewContentProps = {
  model: ReturnType<typeof useAnalyticsOverviewModel>;
};

export const AnalyticsOverviewContent = ({ model }: AnalyticsOverviewContentProps) => {
  const { t } = useI18n();

  if (model.query.isLoading) {
    return <DataState message={t("pages.analytics.states.loading")} />;
  }

  if (model.query.isError) {
    return (
      <DataState
        tone="error"
        message={t("pages.analytics.states.error")}
        action={
          <button
            type="button"
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
            onClick={() => model.query.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (!model.query.data) {
    return <DataState message={t("pages.analytics.states.empty")} />;
  }

  return (
    <>
      <AnalyticsMetricsSection metrics={model.query.data.metrics} />

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardRevenueChart data={model.query.data.revenue} />
        <DashboardOrdersTrend data={model.query.data.ordersPerDay} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <AnalyticsJobsByCategoryChart data={model.query.data.jobsByCategory} />
        <DashboardMechanicWorkload items={model.query.data.mechanicWorkload} />
      </div>
    </>
  );
};
