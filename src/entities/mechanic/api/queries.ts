import { useQuery } from "@tanstack/react-query";

import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { queryKeys } from "@/shared/api/query-keys";
import type { MechanicsRange, MechanicsRegistryParams } from "../model/types";
import { getMechanicsRegistry, getMechanicsWorkload } from "./requests";

export function useMechanicsRegistryQuery(params: MechanicsRegistryParams = {}) {
  return useQuery({
    queryKey: queryKeys.mechanics.registry(params),
    queryFn: () => getMechanicsRegistry(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useMechanicsWorkloadQuery(range: MechanicsRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.mechanics.workload(range),
    queryFn: () => getMechanicsWorkload(range),
  });
}
