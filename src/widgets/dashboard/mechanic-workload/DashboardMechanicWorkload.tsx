import type { MechanicWorkloadItem } from "@/entities/dashboard/model/types";
import { getWorkloadTone } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardMechanicWorkloadProps = {
  items: MechanicWorkloadItem[];
};

const toneClassMap: Record<string, string> = {
  normal: "bg-[rgba(34,197,94,0.2)] text-[#bbf7d0]",
  warning: "bg-[rgba(245,158,11,0.2)] text-[#fde68a]",
  danger: "bg-[rgba(239,68,68,0.2)] text-[#fecaca]",
};

export const DashboardMechanicWorkload = ({ items }: DashboardMechanicWorkloadProps) => {
  const { t } = useI18n();

  return (
    <WidgetCard title={t("dashboard.mechanicWorkload.title")} description={t("dashboard.mechanicWorkload.description")}>
      <ul className="m-0 grid list-none gap-3 p-0">
        {items.map((item) => (
          <li
            key={item.mechanicId}
            className="rounded-xl border border-[rgba(154,164,178,0.16)] bg-[rgba(15,17,21,0.2)] p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="m-0 text-sm font-semibold">{item.mechanicName}</p>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  toneClassMap[getWorkloadTone(item.utilization)] ?? toneClassMap.normal,
                ].join(" ")}
              >
                {item.assignedOrders} {t("common.active")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(154,164,178,0.2)]">
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
    </WidgetCard>
  );
};
