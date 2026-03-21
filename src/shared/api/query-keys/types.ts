export type DashboardRangeKey = "7d" | "30d" | "90d";

export interface DashboardRecentOrdersParamsKey {
  range?: DashboardRangeKey;
  limit?: number;
}

export interface OrdersListParamsKey {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
  priority?: string;
  assignedMechanic?: string;
  createdFrom?: string;
  createdTo?: string;
}

export interface CustomersListParamsKey {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface VehiclesListParamsKey {
  page?: number;
  pageSize?: number;
  search?: string;
}
