import type { AnalyticsMetrics } from "@/entities/analytics/model/types";
import { formatCurrency } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";

type AnalyticsMetricsSectionProps = {
  metrics: AnalyticsMetrics;
};

export const AnalyticsMetricsSection = ({ metrics }: AnalyticsMetricsSectionProps) => {
  const { t, locale } = useI18n();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <WidgetCard title={t("pages.analytics.metrics.totalRevenue")}>
        <p className="mb-1.5 mt-1 text-[30px] font-bold leading-[1.1]">{formatCurrency(metrics.totalRevenue, locale)}</p>
      </WidgetCard>
      <WidgetCard title={t("pages.analytics.metrics.averageOrderValue")}>
        <p className="mb-1.5 mt-1 text-[30px] font-bold leading-[1.1]">{formatCurrency(metrics.averageOrderValue, locale)}</p>
      </WidgetCard>
      <WidgetCard title={t("pages.analytics.metrics.completionRate")}>
        <p className="mb-1.5 mt-1 text-[30px] font-bold leading-[1.1]">{metrics.completionRate}%</p>
      </WidgetCard>
      <WidgetCard title={t("pages.analytics.metrics.activeMechanics")}>
        <p className="mb-1.5 mt-1 text-[30px] font-bold leading-[1.1]">{metrics.activeMechanics}</p>
      </WidgetCard>
    </div>
  );
};
