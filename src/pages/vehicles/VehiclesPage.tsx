import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function VehiclesPage() {
  return (
    <PagePlaceholder
      eyebrow="Registry"
      title="Vehicles registry"
      description="The vehicles screen will cover search, vehicle inventory tables, and navigation to service history."
    >
      <PlaceholderCard title="Vehicle Table" text="Plate number, VIN, make, model, year, owner, and orders count will be tracked here." />
      <PlaceholderCard title="Service History" text="Vehicle details will surface service history and related orders." />
      <PlaceholderCard title="Shared Patterns" text="Loading, empty, and error states will follow the same data-screen conventions as other registries." />
    </PagePlaceholder>
  );
}
