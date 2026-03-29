import { useParams } from "react-router-dom";

export function useVehicleDetailsPageModel() {
  const { vehicleId } = useParams();

  return {
    vehicleId,
  };
}
