import { dashboardQueryKeys } from "./query-keys/dashboard";
import { ordersQueryKeys } from "./query-keys/orders";
import { vehiclesQueryKeys } from "./query-keys/vehicles";

export const queryKeys = {
  dashboard: dashboardQueryKeys,
  orders: ordersQueryKeys,
  vehicles: vehiclesQueryKeys,
} as const;

export type {
  DashboardRangeKey,
  DashboardRecentOrdersParamsKey,
  OrdersListParamsKey,
  VehiclesListParamsKey,
} from "./query-keys/types";
