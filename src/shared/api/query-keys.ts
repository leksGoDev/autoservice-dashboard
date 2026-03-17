import { dashboardQueryKeys } from "./query-keys/dashboard";
import { ordersQueryKeys } from "./query-keys/orders";

export const queryKeys = {
  dashboard: dashboardQueryKeys,
  orders: ordersQueryKeys,
} as const;

export type {
  DashboardRangeKey,
  DashboardRecentOrdersParamsKey,
  OrdersListParamsKey,
} from "./query-keys/types";
