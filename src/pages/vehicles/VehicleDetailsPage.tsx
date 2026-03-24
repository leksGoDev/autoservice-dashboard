import { useVehicleDetailsPageModel } from "@/pages/vehicles/model/use-vehicle-details-page-model";
import { VehicleDetailsView } from "@/widgets/vehicle-details/VehicleDetailsView";

export const VehicleDetailsPage = () => {
  const model = useVehicleDetailsPageModel();

  return (
    <VehicleDetailsView
      vehicleId={model.vehicleId}
      details={model.details}
      history={model.history}
      isLoading={model.isLoading}
      isError={model.isError}
      isEmpty={model.isEmpty}
      onRetry={model.refetchAll}
    />
  );
};
