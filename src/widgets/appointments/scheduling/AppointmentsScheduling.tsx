import { useAppointmentsSchedulingModel } from "./hooks/use-appointments-scheduling-model";
import { AppointmentsSchedulingContent } from "./ui/AppointmentsSchedulingContent";
import { AppointmentsSchedulingHeader } from "./ui/AppointmentsSchedulingHeader";
import { AppointmentsSchedulingToolbar } from "./ui/AppointmentsSchedulingToolbar";

export const AppointmentsScheduling = () => {
  const model = useAppointmentsSchedulingModel();

  return (
    <section className="grid gap-5">
      <AppointmentsSchedulingHeader />

      <AppointmentsSchedulingToolbar
        filters={model.filters}
        mechanics={model.mechanics}
        onChange={model.onToolbarChange}
        onReset={model.onResetFilters}
      />

      <AppointmentsSchedulingContent model={model} />
    </section>
  );
};
