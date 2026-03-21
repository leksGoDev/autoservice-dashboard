import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { VehiclesListParams } from "../model/types";
import { getVehicleDetails, getVehicleServiceHistory, getVehiclesList } from "./requests";

export function useVehiclesListQuery(params: VehiclesListParams = {}) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => getVehiclesList(params),
  });
}

export function useVehicleDetailsQuery(vehicleId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vehicles.detail(vehicleId ?? ""),
    queryFn: () => getVehicleDetails(vehicleId ?? ""),
    enabled: Boolean(vehicleId),
  });
}

export function useVehicleServiceHistoryQuery(vehicleId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.vehicles.serviceHistory(vehicleId ?? ""),
    queryFn: () => getVehicleServiceHistory(vehicleId ?? ""),
    enabled: Boolean(vehicleId),
  });
}
