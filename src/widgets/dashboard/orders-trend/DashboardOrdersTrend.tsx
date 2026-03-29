import type { DashboardOrdersTrendPoint } from "@/entities/dashboard/model/types";
import { formatDashboardChartDate } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

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

import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardOrdersTrendProps = {
  data: DashboardOrdersTrendPoint[];
};

const chartTooltipStyle = {
  border: "1px solid #2a3142",
  borderRadius: "12px",
  background: "#151922",
  color: "#e6eaf2",
};

export const DashboardOrdersTrend = ({ data }: DashboardOrdersTrendProps) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard
      title={t("dashboard.ordersTrend.title")}
      description={t("dashboard.ordersTrend.description")}
      className="min-h-[320px]"
    >
      <div className="h-[240px] min-w-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(154, 164, 178, 0.12)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#9aa4b2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: string) => formatDashboardChartDate(value, locale)}
            />
            <YAxis tick={{ fill: "#9aa4b2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="total" name={t("dashboard.ordersTrend.total")} fill="#6ba4ff" radius={[6, 6, 0, 0]} />
            <Bar
              dataKey="completed"
              name={t("dashboard.ordersTrend.completed")}
              fill="#22c55e"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};
