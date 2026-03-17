import type { RecentActivityItem, RecentActivityType } from "@/entities/dashboard/model/types";

import { WidgetCard } from "../../shared/ui/WidgetCard";

type DashboardRecentActivityProps = {
  items: RecentActivityItem[];
};

function toneFromActivityType(type: RecentActivityType) {
  if (type === "parts_updated") {
    return "warning";
  }

  if (type === "status_changed") {
    return "success";
  }

  if (type === "order_created" || type === "order_scheduled" || type === "mechanic_assigned") {
    return "neutral";
  }

  return "neutral";
}

function formatRelativeTime(dateIso: string) {
  const timestamp = new Date(dateIso).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(0, Math.round((now - timestamp) / 60000));

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} h ago`;
  }

  return new Date(dateIso).toLocaleDateString();
}

export function DashboardRecentActivity({ items }: DashboardRecentActivityProps) {
  return (
    <WidgetCard title="Recent Activity" description="Operational changes in chronological order">
      <ul className="activity-feed">
        {items.map((item) => (
          <li key={item.id} className="activity-feed__item">
            <span
              className={`activity-feed__dot activity-feed__dot--${toneFromActivityType(item.type)}`}
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
}
