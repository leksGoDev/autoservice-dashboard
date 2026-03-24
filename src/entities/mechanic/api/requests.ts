import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type {
  MechanicRegistryItem,
  MechanicWorkloadItem,
  MechanicsRange,
  MechanicsRegistryParams,
} from "../model/types";

export function getMechanicsRegistry(params: MechanicsRegistryParams = {}) {
  return httpRequest<ListResponse<MechanicRegistryItem>>(apiEndpoints.mechanics.registry, {
    method: "GET",
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    },
  });
}

export function getMechanicsWorkload(range: MechanicsRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<MechanicWorkloadItem[]>(apiEndpoints.mechanics.workload, {
    method: "GET",
    query: { range },
  });
}
