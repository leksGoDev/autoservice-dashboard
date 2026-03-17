import type { DashboardMetrics } from "@/entities/dashboard/model/types";

import { WidgetCard } from "../../shared/ui/WidgetCard";

type DashboardKpiCardsProps = {
  metrics: DashboardMetrics;
};

type KpiCard = {
  id: string;
  label: string;
  value: string;
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export function DashboardKpiCards({ metrics }: DashboardKpiCardsProps) {
  const items: KpiCard[] = [
    { id: "active", label: "Active Orders", value: String(metrics.active) },
    { id: "overdue", label: "Overdue Orders", value: String(metrics.overdue) },
    { id: "scheduled", label: "Scheduled Orders", value: String(metrics.scheduled) },
    { id: "today", label: "Revenue Today", value: formatCurrency(metrics.revenueToday) },
    {
      id: "month",
      label: "Revenue This Month",
      value: formatCurrency(metrics.revenueThisMonth),
    },
  ];

  return (
    <div className="dashboard-kpi-grid">
      {items.map((item) => (
        <WidgetCard key={item.id} title={item.label} className="dashboard-kpi-grid__item">
          <p className="dashboard-kpi-grid__value">{item.value}</p>
        </WidgetCard>
      ))}
    </div>
  );
}
