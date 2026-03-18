import type { FC } from "react";

import type { RecentActivityItem } from "@/entities/dashboard/model/types";
import { formatRelativeTime, getActivityTone } from "@/entities/dashboard/model/presentation";
import { useI18n } from "@/shared/i18n/use-i18n";

import { WidgetCard } from "@/shared/ui/WidgetCard";

interface DashboardRecentActivityProps {
  items: RecentActivityItem[];
}

export const DashboardRecentActivity: FC<DashboardRecentActivityProps> = ({ items }) => {
  const { t, locale } = useI18n();

  return (
    <WidgetCard title={t("dashboard.recentActivity.title")} description={t("dashboard.recentActivity.description")}>
      <ul className="activity-feed">
        {items.map((item) => (
          <li key={item.id} className="activity-feed__item">
            <span
              className={`activity-feed__dot activity-feed__dot--${getActivityTone(item.type)}`}
              aria-hidden="true"
            />
            <div className="activity-feed__content">
              <p className="activity-feed__title">{item.message}</p>
              <p className="activity-feed__details">{item.orderId}</p>
            </div>
            <time className="activity-feed__time">{formatRelativeTime(item.createdAt, locale)}</time>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};
