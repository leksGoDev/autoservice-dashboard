import type { JobsByCategoryPoint } from "@/entities/analytics/model/types";
import { useI18n } from "@/shared/i18n/use-i18n";
import { WidgetCard } from "@/shared/ui/WidgetCard";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MeasuredChart } from "@/shared/ui/MeasuredChart";

type AnalyticsJobsByCategoryChartProps = {
  data: JobsByCategoryPoint[];
};

const chartTooltipStyle = {
  border: "1px solid #2a3142",
  borderRadius: "12px",
  background: "#151922",
  color: "#e6eaf2",
};

export const AnalyticsJobsByCategoryChart = ({ data }: AnalyticsJobsByCategoryChartProps) => {
  const { t } = useI18n();

  return (
    <WidgetCard
      title={t("pages.analytics.jobsByCategory.title")}
      description={t("pages.analytics.jobsByCategory.description")}
      className="min-h-[320px]"
    >
      <MeasuredChart className="h-[240px] min-w-0 w-full" fallbackHeight={240}>
        {({ width, height }) => (
          <BarChart width={width} height={height} data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(154, 164, 178, 0.12)" strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fill: "#9aa4b2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#9aa4b2", fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={chartTooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="scheduled" stackId="jobs" name={t("pages.analytics.jobsByCategory.scheduled")} fill="#64748b" />
            <Bar dataKey="inProgress" stackId="jobs" name={t("pages.analytics.jobsByCategory.inProgress")} fill="#f59e0b" />
            <Bar dataKey="completed" stackId="jobs" name={t("pages.analytics.jobsByCategory.completed")} fill="#22c55e" />
          </BarChart>
        )}
      </MeasuredChart>
    </WidgetCard>
  );
};
