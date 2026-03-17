export type DashboardRangeKey = "7d" | "30d" | "90d";

export interface OrdersListParamsKey {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
  status?: string;
}
