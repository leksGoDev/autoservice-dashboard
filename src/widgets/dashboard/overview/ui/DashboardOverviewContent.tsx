import { lazy, Suspense } from "react";

import { DataState } from "@/shared/ui/DataState";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DashboardKpiCards } from "@/widgets/dashboard/kpi-cards/DashboardKpiCards";
import { DashboardMechanicWorkload } from "@/widgets/dashboard/mechanic-workload/DashboardMechanicWorkload";
import { DashboardRecentActivity } from "@/widgets/dashboard/recent-activity/DashboardRecentActivity";
import { DashboardRecentOrders } from "@/widgets/dashboard/recent-orders/DashboardRecentOrders";
import type { DashboardOverviewModel } from "../hooks/use-dashboard-overview-model";

const DashboardRevenueChart = lazy(() =>
  import("@/widgets/dashboard/revenue-chart/DashboardRevenueChart").then((module) => ({
    default: module.DashboardRevenueChart,
  })),
);
const DashboardOrdersTrend = lazy(() =>
  import("@/widgets/dashboard/orders-trend/DashboardOrdersTrend").then((module) => ({
    default: module.DashboardOrdersTrend,
  })),
);

type DashboardOverviewContentProps = {
  overviewQuery: DashboardOverviewModel["overviewQuery"];
};

export const DashboardOverviewContent = ({ overviewQuery }: DashboardOverviewContentProps) => {
  const { t } = useI18n();

  if (overviewQuery.isLoading) {
    return <DataState message={t("dashboardPage.loading")} />;
  }

  if (overviewQuery.isError) {
    return (
      <DataState
        tone="error"
        message={t("dashboardPage.error")}
        action={
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 text-xs leading-4 font-medium text-[var(--color-text-primary)]"
            onClick={() => overviewQuery.refetch()}
          >
            {t("common.retry")}
          </button>
        }
      />
    );
  }

  if (!overviewQuery.data) {
    return <DataState message={t("dashboardPage.empty")} />;
  }

  return (
    <>
      <DashboardKpiCards metrics={overviewQuery.data.metrics} />

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense
          fallback={
            <div className="min-h-[320px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4 text-sm text-[var(--color-text-secondary)]">
              {t("common.pageLoading")}
            </div>
          }
        >
          <DashboardRevenueChart data={overviewQuery.data.revenue} />
        </Suspense>
        <Suspense
          fallback={
            <div className="min-h-[320px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4 text-sm text-[var(--color-text-secondary)]">
              {t("common.pageLoading")}
            </div>
          }
        >
          <DashboardOrdersTrend data={overviewQuery.data.ordersTrend} />
        </Suspense>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <DashboardRecentOrders orders={overviewQuery.data.recentOrders} />
        <div className="grid content-start gap-4">
          <DashboardMechanicWorkload items={overviewQuery.data.mechanicWorkload} />
          <DashboardRecentActivity items={overviewQuery.data.recentActivity} />
        </div>
      </div>
    </>
  );
};
