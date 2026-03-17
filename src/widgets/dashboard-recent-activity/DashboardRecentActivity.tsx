import { WidgetCard } from "../../shared/ui/WidgetCard";

export type ActivityItem = {
  id: string;
  title: string;
  details: string;
  time: string;
  tone: "neutral" | "success" | "warning" | "danger";
};

type DashboardRecentActivityProps = {
  items: ActivityItem[];
};

export function DashboardRecentActivity({ items }: DashboardRecentActivityProps) {
  return (
    <WidgetCard title="Recent Activity" description="Operational changes in chronological order">
      <ul className="activity-feed">
        {items.map((item) => (
          <li key={item.id} className="activity-feed__item">
            <span className={`activity-feed__dot activity-feed__dot--${item.tone}`} aria-hidden="true" />
            <div className="activity-feed__content">
              <p className="activity-feed__title">{item.title}</p>
              <p className="activity-feed__details">{item.details}</p>
            </div>
            <time className="activity-feed__time">{item.time}</time>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
