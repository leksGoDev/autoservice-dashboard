import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function DashboardPage() {
  return (
    <PagePlaceholder
      eyebrow="Overview"
      title="Operational dashboard scaffold"
      description="Foundation screen for KPI cards, revenue charts, orders trend, mechanic workload, recent orders, and recent activity."
    >
      <PlaceholderCard title="KPI Cards" text="Active orders, overdue work, scheduled jobs, daily revenue, and monthly revenue." />
      <PlaceholderCard title="Charts" text="Revenue and orders trend widgets will connect to TanStack Query and mocked endpoints." />
      <PlaceholderCard title="Activity Feed" text="Recent orders and activity will live in widgets once the data layer is wired." />
    </PagePlaceholder>
  );
}
