import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function AnalyticsPage() {
  return (
    <PagePlaceholder
      eyebrow="Insights"
      title="Analytics workspace"
      description="Analytics will aggregate revenue, orders per day, job categories, mechanic workload, and time-range filters."
    >
      <PlaceholderCard title="Chart Zone" text="Line, bar, and stacked bar charts will use Recharts on top of prepared query view-models." />
      <PlaceholderCard title="Filters" text="URL-driven time-range controls will keep the screen reproducible and shareable." />
      <PlaceholderCard title="Prepared Data" text="Heavy chart transformations should stay outside the page layer." />
    </PagePlaceholder>
  );
}
