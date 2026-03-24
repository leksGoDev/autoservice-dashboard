import { useVehicleDetailsQuery, useVehicleServiceHistoryQuery } from "@/entities/vehicle/api/queries";

export const useVehicleDetailsViewModel = (vehicleId: string | undefined) => {
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
