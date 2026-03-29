import { useVehicleDetailsPageModel } from "@/pages/vehicles/model/use-vehicle-details-model";
import { VehicleDetailsView } from "@/widgets/vehicles/details/VehicleDetailsView";

export const VehicleDetailsPage = () => {
  const { vehicleId } = useVehicleDetailsPageModel();
  return <VehicleDetailsView vehicleId={vehicleId} />;
};
