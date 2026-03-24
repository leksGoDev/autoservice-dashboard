import { analyticsQueryKeys } from "./query-keys/analytics";
import { customersQueryKeys } from "./query-keys/customers";
import { dashboardQueryKeys } from "./query-keys/dashboard";
import { mechanicsQueryKeys } from "./query-keys/mechanics";
import { ordersQueryKeys } from "./query-keys/orders";
import { vehiclesQueryKeys } from "./query-keys/vehicles";

export const queryKeys = {
  analytics: analyticsQueryKeys,
  customers: customersQueryKeys,
  dashboard: dashboardQueryKeys,
  mechanics: mechanicsQueryKeys,
  orders: ordersQueryKeys,
  vehicles: vehiclesQueryKeys,
} as const;

export type {
  MechanicsRegistryParamsKey,
  CustomersListParamsKey,
  DashboardRangeKey,
  DashboardRecentOrdersParamsKey,
  OrdersListParamsKey,
  VehiclesListParamsKey,
} from "./query-keys/types";
