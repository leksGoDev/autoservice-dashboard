import type { RecentActivityItem } from "@/entities/dashboard/model/types";
import { formatRelativeTime, getActivityTone } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

import { WidgetCard } from "@/shared/ui/WidgetCard";

type DashboardRecentActivityProps = {
  items: RecentActivityItem[];
};

const toneClassMap: Record<string, string> = {
  neutral: "bg-[var(--color-info)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
};

export const DashboardRecentActivity = ({ items }: DashboardRecentActivityProps) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard title={t("dashboard.recentActivity.title")} description={t("dashboard.recentActivity.description")}>
      <ul className="m-0 grid list-none gap-3 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[12px_minmax(0,1fr)_auto] items-start gap-[10px] border-b border-[rgba(154,164,178,0.12)] py-2.5 last:border-b-0"
          >
            <span
              className={[
                "mt-1 h-[10px] w-[10px] rounded-full",
                toneClassMap[getActivityTone(item.type)] ?? toneClassMap.neutral,
              ].join(" ")}
              aria-hidden="true"
            />
            <div className="grid gap-1">
              <p className="m-0 text-sm">{item.message}</p>
              <p className="m-0 text-[13px] text-[var(--color-text-secondary)]">{item.orderId}</p>
            </div>
            <time className="whitespace-nowrap text-xs text-[var(--color-text-muted)]">
              {formatRelativeTime(item.createdAt, locale)}
            </time>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};
