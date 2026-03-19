import type { DashboardRevenuePoint } from "@/entities/dashboard/model/types";
import { formatCurrency, formatDashboardChartDate } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardRevenueChartProps = {
  data: DashboardRevenuePoint[];
};

const chartTooltipStyle = {
  border: "1px solid #2a3142",
  borderRadius: "12px",
  background: "#151922",
  color: "#e6eaf2",
};

export const DashboardRevenueChart = ({ data }: DashboardRevenueChartProps) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard
      title={t("dashboard.revenueChart.title")}
      description={t("dashboard.revenueChart.description")}
      className="min-h-[320px]"
    >
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboardRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6ba4ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6ba4ff" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(154, 164, 178, 0.12)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9aa4b2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => formatDashboardChartDate(value, locale)}
            />
            <YAxis
              tick={{ fill: "#9aa4b2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value) => {
                const amount = typeof value === "number" ? value : Number(value ?? 0);

                return [formatCurrency(amount, locale), t("dashboard.revenueChart.tooltipRevenue")];
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
};
