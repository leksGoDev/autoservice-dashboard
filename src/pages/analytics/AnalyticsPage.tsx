import type { ReactNode } from "react";

import { DataState } from "@/shared/ui/DataState";
import { DashboardMechanicWorkload } from "@/widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import { DashboardOrdersTrend } from "@/widgets/dashboard-orders-trend/DashboardOrdersTrend";
import { DashboardRevenueChart } from "@/widgets/dashboard-revenue-chart/DashboardRevenueChart";
import { AnalyticsJobsByCategoryChart } from "@/widgets/analytics-jobs-by-category/AnalyticsJobsByCategoryChart";
import { useI18n } from "@/shared/i18n/use-i18n";
import { AnalyticsOverviewHeader } from "@/widgets/analytics-overview/ui/AnalyticsOverviewHeader";
import { AnalyticsMetricsSection } from "@/widgets/analytics-overview/ui/AnalyticsMetricsSection";
import { useAnalyticsPageModel } from "./model/use-analytics-page-model";

export const AnalyticsPage = () => {
  const { t } = useI18n();
  const model = useAnalyticsPageModel();

  let content: ReactNode;

  if (model.isLoading) {
    content = <DataState message={t("pages.analytics.states.loading")} />;
  } else if (model.isError) {
    content = (
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
  } else if (!model.data) {
    content = <DataState message={t("pages.analytics.states.empty")} />;
  } else {
    content = (
      <>
        <AnalyticsMetricsSection metrics={model.data.metrics} />

        <div className="grid gap-4 md:grid-cols-2">
          <DashboardRevenueChart data={model.data.revenue} />
          <DashboardOrdersTrend data={model.data.ordersPerDay} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <AnalyticsJobsByCategoryChart data={model.data.jobsByCategory} />
          <DashboardMechanicWorkload items={model.data.mechanicWorkload} />
        </div>
      </>
    );
  }

  return (
    <section className="grid gap-5">
      <AnalyticsOverviewHeader range={model.range} onRangeChange={model.setRange} />
      {content}
    </section>
  );
};
