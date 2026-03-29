import { appointmentsQueryKeys } from "./query-keys/appointments";
import { analyticsQueryKeys } from "./query-keys/analytics";
import { customersQueryKeys } from "./query-keys/customers";
import { dashboardQueryKeys } from "./query-keys/dashboard";
import { mechanicsQueryKeys } from "./query-keys/mechanics";
import { ordersQueryKeys } from "./query-keys/orders";
import { searchQueryKeys } from "./query-keys/search";
import { vehiclesQueryKeys } from "./query-keys/vehicles";
import { workBoardQueryKeys } from "./query-keys/work-board";

export const queryKeys = {
  appointments: appointmentsQueryKeys,
  analytics: analyticsQueryKeys,
  customers: customersQueryKeys,
  dashboard: dashboardQueryKeys,
  mechanics: mechanicsQueryKeys,
  orders: ordersQueryKeys,
  search: searchQueryKeys,
  vehicles: vehiclesQueryKeys,
  workBoard: workBoardQueryKeys,
} as const;

export type {
  AppointmentsListParamsKey,
  MechanicsRegistryParamsKey,
  CustomersListParamsKey,
  DashboardRangeKey,
  DashboardRecentOrdersParamsKey,
  GlobalSearchParamsKey,
  OrdersListParamsKey,
  VehiclesListParamsKey,
} from "./query-keys/types";
