import type { FC } from "react";

import type { RecentActivityItem } from "@/entities/dashboard/model/types";
import { formatRelativeTime, getActivityTone } from "@/entities/dashboard/model/presentation";

import { WidgetCard } from "@/shared/ui/WidgetCard";

interface DashboardRecentActivityProps {
  items: RecentActivityItem[];
}

export const DashboardRecentActivity: FC<DashboardRecentActivityProps> = ({ items }) => {
  return (
    <WidgetCard title="Recent Activity" description="Operational changes in chronological order">
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
            <time className="activity-feed__time">{formatRelativeTime(item.createdAt)}</time>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};
