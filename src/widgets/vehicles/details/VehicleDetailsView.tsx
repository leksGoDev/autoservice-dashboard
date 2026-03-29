import { useVehicleDetailsViewModel } from "./hooks/use-vehicle-details-model";
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
