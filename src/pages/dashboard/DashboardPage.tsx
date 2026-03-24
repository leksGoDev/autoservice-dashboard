import { useState } from "react";

import type { DashboardRange } from "@/entities/dashboard/model/types";
import { useDashboardOverviewQuery } from "@/entities/dashboard/api/queries";
import { DASHBOARD_RANGES, DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DataState } from "@/shared/ui/DataState";
import { DashboardKpiCards } from "@/widgets/dashboard-kpi-cards/DashboardKpiCards";
import { DashboardMechanicWorkload } from "@/widgets/dashboard-mechanic-workload/DashboardMechanicWorkload";
import { DashboardRevenueChart } from "@/widgets/dashboard-revenue-chart/DashboardRevenueChart";
import { DashboardOrdersTrend } from "@/widgets/dashboard-orders-trend/DashboardOrdersTrend";
import { DashboardRecentOrders } from "@/widgets/dashboard-recent-orders/DashboardRecentOrders";
import { DashboardRecentActivity } from "@/widgets/dashboard-recent-activity/DashboardRecentActivity";

type DashboardHeaderProps = {
  range: DashboardRange;
  onRangeChange: (value: DashboardRange) => void;
};

const rangeButtonClass =
  "cursor-pointer rounded-full border border-[var(--color-border)] bg-[rgba(15,17,21,0.45)] px-2.5 py-1.5 text-xs font-bold tracking-[0.04em] text-[var(--color-text-secondary)] transition-colors";
const activeRangeButtonClass =
  "border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.2)] text-[var(--color-text-primary)]";

const DashboardHeader = ({ range, onRangeChange }: DashboardHeaderProps) => {
  const { t } = useI18n();

  return (
    <header className="rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-6">
      <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-light-blue)]">
        {t("dashboardPage.eyebrow")}
      </span>
      <h1 className="mb-2 mt-2.5 text-[28px] leading-[1.15]">{t("dashboardPage.title")}</h1>
      <p className="m-0 text-[var(--color-text-secondary)]">{t("dashboardPage.description")}</p>
      <div className="mt-[14px] flex gap-2">
        {DASHBOARD_RANGES.map((value) => (
          <button
            key={value}
            type="button"
            className={[rangeButtonClass, value === range ? activeRangeButtonClass : ""].join(" ").trim()}
            onClick={() => onRangeChange(value)}
          >
            {value.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  );
};

export const DashboardPage = () => {
  const [range, setRange] = useState<DashboardRange>(DEFAULT_DASHBOARD_RANGE);
  const overviewQuery = useDashboardOverviewQuery(range);

  return (
    <section className="grid gap-5">
      <DashboardHeader range={range} onRangeChange={setRange} />
      <DashboardPageContent overviewQuery={overviewQuery} />
    </section>
  );
};

type DashboardPageContentProps = {
  overviewQuery: ReturnType<typeof useDashboardOverviewQuery>;
};

const DashboardPageContent = ({ overviewQuery }: DashboardPageContentProps) => {
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
            className="cursor-pointer rounded-[10px] border border-[rgba(107,164,255,0.4)] bg-[rgba(107,164,255,0.18)] px-3 py-2 text-[var(--color-text-primary)]"
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
        <DashboardRevenueChart data={overviewQuery.data.revenue} />
        <DashboardOrdersTrend data={overviewQuery.data.ordersTrend} />
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
