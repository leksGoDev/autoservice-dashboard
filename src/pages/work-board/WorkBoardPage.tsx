import { PagePlaceholder } from "../../shared/ui/PagePlaceholder";
import { PlaceholderCard } from "../../shared/ui/PlaceholderCard";

export function WorkBoardPage() {
  return (
    <PagePlaceholder
      eyebrow="Core Feature"
      title="Work board scaffold"
      description="The work board will become a kanban-style operational screen for moving orders through service statuses."
    >
      <PlaceholderCard title="Columns" text="Scheduled, In Progress, Waiting Parts, and Completed columns will map to order statuses." />
      <PlaceholderCard title="Cards" text="Each card will show order number, vehicle, priority, assigned mechanic, and quick actions." />
      <PlaceholderCard title="Interactions" text="Drag and drop and quick status updates will be implemented in the next stage." />
    </PagePlaceholder>
  );
}
