import type { AnalyticsOverview as AnalyticsOverviewData, AnalyticsRange } from "@/entities/analytics/model/types";
import { DataState } from "@/shared/ui/DataState";
import { DashboardMechanicWorkload } from "@/widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import { DashboardOrdersTrend } from "@/widgets/dashboard-orders-trend/DashboardOrdersTrend";
import { DashboardRevenueChart } from "@/widgets/dashboard-revenue-chart/DashboardRevenueChart";
import { AnalyticsJobsByCategoryChart } from "@/widgets/analytics-jobs-by-category/AnalyticsJobsByCategoryChart";
import { useI18n } from "@/shared/i18n/use-i18n";
import { AnalyticsHeader } from "./ui/AnalyticsHeader";
import { AnalyticsMetricsSection } from "./ui/AnalyticsMetricsSection";

type AnalyticsOverviewProps = {
  range: AnalyticsRange;
  onRangeChange: (value: AnalyticsRange) => void;
  isLoading: boolean;
  isError: boolean;
  data: AnalyticsOverviewData | undefined;
  onRetry: () => void;
};

export const AnalyticsOverview = ({
  range,
  onRangeChange,
  isLoading,
  isError,
  data,
  onRetry,
}: AnalyticsOverviewProps) => {
  const { t } = useI18n();

  return (
    <section className="grid gap-5">
      <AnalyticsHeader range={range} onRangeChange={onRangeChange} />

      {isLoading ? <DataState message={t("pages.analytics.states.loading")} /> : null}

      {isError ? (
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
      ) : null}

      {!isLoading && !isError && !data ? <DataState message={t("pages.analytics.states.empty")} /> : null}

      {!isLoading && !isError && data ? (
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
      ) : null}
    </section>
  );
};
