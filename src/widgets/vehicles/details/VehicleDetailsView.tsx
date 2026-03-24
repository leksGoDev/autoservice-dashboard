import { useVehicleDetailsViewModel } from "./model/use-vehicle-details-view-model";
import { VehicleDetailsContent } from "./ui/VehicleDetailsContent";
import { VehicleDetailsHeader } from "./ui/VehicleDetailsHeader";

type VehicleDetailsViewProps = {
  vehicleId: string | undefined;
};

export const VehicleDetailsView = ({ vehicleId }: VehicleDetailsViewProps) => {
  const model = useVehicleDetailsViewModel(vehicleId);

  return (
    <section className="grid gap-5">
      <VehicleDetailsHeader vehicleId={vehicleId} />
      <VehicleDetailsContent model={model} />
    </section>
  );
};
