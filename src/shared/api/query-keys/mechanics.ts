import { DEFAULT_DASHBOARD_RANGE, DEFAULT_LIST_PAGE, DEFAULT_LIST_PAGE_SIZE } from "../constants";
import type { DashboardRangeKey, MechanicsRegistryParamsKey } from "./types";

function normalizeMechanicsParams(params: MechanicsRegistryParamsKey = {}) {
  return {
    page: params.page ?? DEFAULT_LIST_PAGE,
    pageSize: params.pageSize ?? DEFAULT_LIST_PAGE_SIZE,
    search: params.search ?? "",
  };
}

export const mechanicsQueryKeys = {
  root: ["mechanics"] as const,
  registry: (params: MechanicsRegistryParamsKey = {}) =>
    ["mechanics", "registry", normalizeMechanicsParams(params)] as const,
  workload: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) => ["mechanics", "workload", range] as const,
} as const;
