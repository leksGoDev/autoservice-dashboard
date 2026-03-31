import type { MechanicWorkloadItem } from "@/entities/dashboard/model/types";
import { getWorkloadTone } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { Link } from "react-router-dom";

import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardMechanicWorkloadProps = {
  items: MechanicWorkloadItem[];
  compact?: boolean;
};

const toneClassMap: Record<string, string> = {
  normal: "bg-[rgba(34,197,94,0.2)] text-[#bbf7d0]",
  warning: "bg-[rgba(245,158,11,0.2)] text-[#fde68a]",
  danger: "bg-[rgba(239,68,68,0.2)] text-[#fecaca]",
};

export const DashboardMechanicWorkload = ({ items, compact = false }: DashboardMechanicWorkloadProps) => {
  const { t } = useI18n();
  const visibleItems = compact ? items.slice(0, 3) : items;

  return (
    <WidgetCard
      title={t("dashboard.mechanicWorkload.title")}
      description={t("dashboard.mechanicWorkload.description")}
      className={compact ? "p-3" : undefined}
    >
      <ul className={["m-0 grid list-none p-0", compact ? "gap-2.5" : "gap-3"].join(" ")}>
        {visibleItems.map((item) => (
          <li
            key={item.mechanicId}
            className={[
              "rounded-xl border border-[rgba(154,164,178,0.16)] bg-[rgba(15,17,21,0.2)]",
              compact ? "p-2.5" : "p-3",
            ].join(" ")}
          >
            <div className={["flex items-center justify-between gap-3", compact ? "mb-1.5" : "mb-2"].join(" ")}>
              <p className={["m-0 font-semibold", compact ? "text-[13px]" : "text-sm"].join(" ")}>{item.mechanicName}</p>
              <span
                className={[
                  "rounded-full text-xs font-semibold",
                  compact ? "px-1.5 py-0.5" : "px-2 py-0.5",
                  toneClassMap[getWorkloadTone(item.utilization)] ?? toneClassMap.normal,
                ].join(" ")}
              >
                {item.assignedOrders} {t("common.active")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div
                className={[
                  "flex-1 overflow-hidden rounded-full bg-[rgba(154,164,178,0.2)]",
                  compact ? "h-1.5" : "h-2",
                ].join(" ")}
              >
                <span
                  className="block h-full rounded-full bg-[linear-gradient(90deg,#6ba4ff,#3b82f6)]"
                  style={{ width: `${item.utilization}%` }}
                />
              </div>
              <span className="min-w-[34px] text-right text-xs text-[var(--color-text-secondary)]">{item.utilization}%</span>
            </div>
          </li>
        ))}
      </ul>
      {compact ? (
        <footer className="mt-2.5 flex items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
          <span>
            {t("dashboard.mechanicWorkload.summary", { shown: visibleItems.length, total: items.length })}
          </span>
          <Link to="/analytics" className="font-semibold text-[var(--color-accent-light-blue)] hover:underline">
            {t("dashboard.mechanicWorkload.openAnalytics")}
          </Link>
        </footer>
      ) : null}
    </WidgetCard>
  );
};
