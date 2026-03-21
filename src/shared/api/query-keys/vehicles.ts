import { DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "../constants";
import type { VehiclesListParamsKey } from "./types";

function normalizeVehiclesParams(params: VehiclesListParamsKey = {}) {
  return {
    page: params.page ?? DEFAULT_LIST_PAGE,
    pageSize: params.pageSize ?? DEFAULT_LIST_PAGE_SIZE,
    search: params.search ?? "",
  };
}

export const vehiclesQueryKeys = {
  root: ["vehicles"] as const,
  list: (params: VehiclesListParamsKey = {}) => ["vehicles", "list", normalizeVehiclesParams(params)] as const,
  detail: (vehicleId: string) => ["vehicles", "detail", vehicleId] as const,
  serviceHistory: (vehicleId: string) => ["vehicles", "service-history", vehicleId] as const,
} as const;
