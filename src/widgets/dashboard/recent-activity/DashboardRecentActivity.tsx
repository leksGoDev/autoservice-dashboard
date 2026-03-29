import type { RecentActivityItem } from "@/entities/dashboard/model/types";
import { formatRelativeTime, getActivityTone } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";
import { Link } from "react-router-dom";

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
              <p className="m-0 text-[13px]">
                <Link
                  to={`/orders/${item.orderId}`}
                  className="inline-flex rounded px-1 py-0.5 text-[var(--color-text-secondary)] underline decoration-transparent underline-offset-2 transition-colors hover:text-[#9ac0ff] hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,197,253,0.7)]"
                >
                  {item.orderId}
                </Link>
              </p>
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
