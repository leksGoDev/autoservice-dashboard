import { useParams } from "react-router-dom";

import { useVehicleDetailsQuery, useVehicleServiceHistoryQuery } from "@/entities/vehicle/api/queries";

export function useVehicleDetailsPageModel() {
  const { vehicleId } = useParams();
  const detailsQuery = useVehicleDetailsQuery(vehicleId);
  const historyQuery = useVehicleServiceHistoryQuery(vehicleId);

  const isLoading = detailsQuery.isLoading || historyQuery.isLoading;
  const isError = detailsQuery.isError || historyQuery.isError;
  const details = detailsQuery.data;
  const history = historyQuery.data ?? [];
  const isEmpty = !isLoading && !isError && !details;

  function refetchAll() {
    detailsQuery.refetch();
    historyQuery.refetch();
  }

  return {
    vehicleId,
    details,
    history,
    isLoading,
    isError,
    isEmpty,
    refetchAll,
  };
}
