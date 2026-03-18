import type { FC } from "react";

import type { DashboardMetrics } from "@/entities/dashboard/model/types";
import { formatCurrency, KPI_CARD_CONFIG } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";

interface DashboardKpiCardsProps {
  metrics: DashboardMetrics;
}

type KpiId = (typeof KPI_CARD_CONFIG)[number]["id"];

type KpiCard = {
  id: KpiId;
  label: string;
  value: string;
};

export const DashboardKpiCards: FC<DashboardKpiCardsProps> = ({ metrics }) => {
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
    <div className="dashboard-kpi-grid">
      {items.map((item) => (
        <WidgetCard key={item.id} title={item.label} className="dashboard-kpi-grid__item">
          <p className="dashboard-kpi-grid__value">{item.value}</p>
        </WidgetCard>
      ))}
    </div>
  );
};
