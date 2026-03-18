import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type { VehicleListItem, VehiclesListParams } from "../model/types";

export function getVehiclesList(params: VehiclesListParams = {}) {
  return httpRequest<ListResponse<VehicleListItem>>(apiEndpoints.vehicles.list, {
    method: "GET",
    query: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search,
    },
  });
}
