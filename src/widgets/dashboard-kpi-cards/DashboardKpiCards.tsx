import { WidgetCard } from "../../shared/ui/WidgetCard";

export type DashboardKpi = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendTone: "up" | "down" | "neutral";
};

type DashboardKpiCardsProps = {
  items: DashboardKpi[];
};

export function DashboardKpiCards({ items }: DashboardKpiCardsProps) {
  return (
    <div className="dashboard-kpi-grid">
      {items.map((item) => (
        <WidgetCard key={item.id} title={item.label} className="dashboard-kpi-grid__item">
          <p className="dashboard-kpi-grid__value">{item.value}</p>
          <p className={`dashboard-kpi-grid__trend dashboard-kpi-grid__trend--${item.trendTone}`}>{item.trend}</p>
        </WidgetCard>
      ))}
    </div>
  );
}
