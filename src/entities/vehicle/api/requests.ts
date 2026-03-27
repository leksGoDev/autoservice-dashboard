import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type { ListResponse } from "@/shared/api/types";
import type {
  CreateVehiclePayload,
  VehicleDetails,
  VehicleListItem,
  VehicleServiceHistoryItem,
  VehiclesListParams,
} from "../model/types";

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

export function getVehicleDetails(vehicleId: string) {
  return httpRequest<VehicleDetails>(apiEndpoints.vehicles.detail(vehicleId), {
    method: "GET",
  });
}

export function getVehicleServiceHistory(vehicleId: string) {
  return httpRequest<VehicleServiceHistoryItem[]>(apiEndpoints.vehicles.serviceHistory(vehicleId), {
    method: "GET",
  });
}

export function createVehicle(payload: CreateVehiclePayload) {
  return httpRequest<VehicleDetails>(apiEndpoints.vehicles.list, {
    method: "POST",
    body: payload,
  });
}
