import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { VehiclesListParams } from "../model/types";
import { getVehiclesList } from "./requests";

export function useVehiclesListQuery(params: VehiclesListParams = {}) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => getVehiclesList(params),
  });
}
