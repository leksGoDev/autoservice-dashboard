import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function CustomersPage() {
  return (
    <PagePlaceholder
      eyebrow="Registry"
      title="Customers registry"
      description="The customers screen will contain search, a paginated table, and drill-down access to customer details."
    >
      <PlaceholderCard title="Search" text="Global and page-level search will reuse shared search behavior." />
      <PlaceholderCard title="Customer Table" text="Columns will include contact information, vehicle count, orders count, and last visit." />
      <PlaceholderCard title="Details Flow" text="Customer details, vehicles list, and order history will be added on dedicated routes." />
    </PagePlaceholder>
  );
}
