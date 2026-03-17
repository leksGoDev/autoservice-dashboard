import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function OrdersPage() {
  return (
    <PagePlaceholder
      eyebrow="Registry"
      title="Orders workspace"
      description="This page will host filters, search, a data table, pagination, and order row actions."
    >
      <PlaceholderCard title="Filters Toolbar" text="Status, priority, mechanic, and date range controls belong here." />
      <PlaceholderCard title="Orders Table" text="Table columns will match the UI spec and use TanStack Table." />
      <PlaceholderCard title="Row Actions" text="Status updates, mechanic assignment, flagging, and details navigation start from this area." />
    </PagePlaceholder>
  );
}
