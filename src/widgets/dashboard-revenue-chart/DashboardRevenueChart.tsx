import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { WidgetCard } from "../../shared/ui/WidgetCard";

export type RevenuePoint = {
  label: string;
  revenue: number;
};

type DashboardRevenueChartProps = {
  data: RevenuePoint[];
};

export function DashboardRevenueChart({ data }: DashboardRevenueChartProps) {
  return (
    <WidgetCard
      title="Revenue Chart"
      description="Daily revenue for the latest operational window"
      className="dashboard-chart-card"
    >
      <div className="dashboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboardRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6ba4ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6ba4ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(154, 164, 178, 0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "#9aa4b2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: "#9aa4b2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #2a3142",
                borderRadius: "12px",
                background: "#151922",
                color: "#e6eaf2",
              }}
              formatter={(value) => {
                const amount = typeof value === "number" ? value : Number(value ?? 0);

                return [`$${amount.toLocaleString()}`, "Revenue"];
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6ba4ff"
              strokeWidth={2}
              fill="url(#dashboardRevenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
