import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { WidgetCard } from "../../shared/ui/WidgetCard";

export type OrdersTrendPoint = {
  label: string;
  created: number;
  completed: number;
};

type DashboardOrdersTrendProps = {
  data: OrdersTrendPoint[];
};

export function DashboardOrdersTrend({ data }: DashboardOrdersTrendProps) {
  return (
    <WidgetCard
      title="Orders Trend"
      description="Created and completed orders by day"
      className="dashboard-chart-card"
    >
      <div className="dashboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(154, 164, 178, 0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "#9aa4b2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#9aa4b2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                border: "1px solid #2a3142",
                borderRadius: "12px",
                background: "#151922",
                color: "#e6eaf2",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="created" name="Created" fill="#6ba4ff" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
