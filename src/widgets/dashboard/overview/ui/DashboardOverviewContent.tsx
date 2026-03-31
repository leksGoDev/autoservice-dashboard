import { lazy, Suspense } from "react";

import { DataState } from "@/shared/ui/DataState";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
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
            className={primaryActionButtonClassName}
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

      <div className="grid gap-4">
        <Suspense
          fallback={
            <div className="min-h-[320px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4 text-sm text-[var(--color-text-secondary)]">
              {t("common.pageLoading")}
            </div>
          }
        >
          <DashboardRevenueChart data={overviewQuery.data.revenue} />
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
