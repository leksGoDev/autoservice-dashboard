import { useVehicleDetailsQuery, useVehicleServiceHistoryQuery } from "@/entities/vehicle/api/queries";
import type { VehicleDetails, VehicleServiceHistoryItem } from "@/entities/vehicle/model/types";

export type VehicleDetailsViewModel = {
  details: VehicleDetails | undefined;
  history: VehicleServiceHistoryItem[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  refetchAll: () => void;
};

export const useVehicleDetailsViewModel = (vehicleId: string | undefined): VehicleDetailsViewModel => {
  const detailsQuery = useVehicleDetailsQuery(vehicleId);
  const historyQuery = useVehicleServiceHistoryQuery(vehicleId);

  const isLoading = detailsQuery.isLoading || historyQuery.isLoading;
  const isError = detailsQuery.isError || historyQuery.isError;
  const details = detailsQuery.data;
  const history = historyQuery.data ?? [];
  const isEmpty = !isLoading && !isError && !details;

  return {
    details,
    history,
    isLoading,
    isError,
    isEmpty,
    refetchAll: () => {
      detailsQuery.refetch();
      historyQuery.refetch();
    },
  };
};
