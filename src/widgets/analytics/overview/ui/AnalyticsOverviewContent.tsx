import { lazy, Suspense } from "react";
import { RotateCcw } from "lucide-react";

import { DataState } from "@/shared/ui/DataState";
import { primaryActionButtonClassName } from "@/shared/ui/class-names";
import { useI18n } from "@/shared/i18n/use-i18n";
import { DashboardMechanicWorkload } from "@/widgets/dashboard/mechanic-workload/DashboardMechanicWorkload";
import { DashboardOrdersTrend } from "@/widgets/dashboard/orders-trend/DashboardOrdersTrend";
import type { AnalyticsOverviewModel } from "../hooks/use-analytics-overview-model";
import { AnalyticsMetricsSection } from "./AnalyticsMetricsSection";

const AnalyticsJobsByCategoryChart = lazy(() =>
  import("@/widgets/analytics/jobs-by-category/AnalyticsJobsByCategoryChart").then((module) => ({
    default: module.AnalyticsJobsByCategoryChart,
  })),
);

type AnalyticsOverviewContentProps = {
  model: AnalyticsOverviewModel;
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
            className={`${primaryActionButtonClassName} gap-1.5`}
            onClick={() => model.query.refetch()}
          >
            <RotateCcw size={14} strokeWidth={2} aria-hidden className="shrink-0 opacity-90" />
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

      <DashboardOrdersTrend data={model.query.data.ordersPerDay} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <Suspense
          fallback={
            <div className="min-h-[320px] rounded-2xl border border-[var(--color-border)] bg-[rgba(27,33,48,0.9)] p-4 text-sm text-[var(--color-text-secondary)]">
              {t("common.pageLoading")}
            </div>
          }
        >
          <AnalyticsJobsByCategoryChart data={model.query.data.jobsByCategory} />
        </Suspense>
        <DashboardMechanicWorkload items={model.query.data.mechanicWorkload} />
      </div>
    </>
  );
};
