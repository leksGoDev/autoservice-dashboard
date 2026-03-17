import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function MechanicsPage() {
  return (
    <PagePlaceholder
      eyebrow="Operations"
      title="Mechanics registry"
      description="This screen will hold mechanic status, specialization, active jobs, and workload-related operational context."
    >
      <PlaceholderCard title="Registry" text="The mechanics table will support search and operational status tracking." />
      <PlaceholderCard title="Availability" text="Mechanic workload data will be shared with dashboard and analytics widgets." />
      <PlaceholderCard title="Assignments" text="Features for assigning mechanics will compose with order and service job flows." />
    </PagePlaceholder>
  );
}
