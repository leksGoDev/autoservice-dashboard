import type { DashboardMetrics } from "@/entities/dashboard/model/types";
import { formatCurrency, KPI_CARD_CONFIG } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardKpiCardsProps = {
  metrics: DashboardMetrics;
};

type KpiId = (typeof KPI_CARD_CONFIG)[number]["id"];

type KpiCard = {
  id: KpiId;
  label: string;
  value: string;
};

export const DashboardKpiCards = ({ metrics }: DashboardKpiCardsProps) => {
  const { t, locale } = useI18n();
  const valueById: Record<KpiId, string> = {
    active: String(metrics.active),
    overdue: String(metrics.overdue),
    scheduled: String(metrics.scheduled),
    today: formatCurrency(metrics.revenueToday, locale),
    month: formatCurrency(metrics.revenueThisMonth, locale),
  };

  const items: KpiCard[] = KPI_CARD_CONFIG.map((item) => ({
    id: item.id,
    label: t(item.labelKey),
    value: valueById[item.id],
  }));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <WidgetCard key={item.id} title={item.label} className="min-h-[122px]">
          <p className="mb-1.5 mt-1 text-[30px] font-bold leading-[1.1]">{item.value}</p>
        </WidgetCard>
      ))}
    </div>
  );
};
