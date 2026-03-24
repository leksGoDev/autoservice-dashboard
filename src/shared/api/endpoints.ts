import { API_PREFIX } from "./constants";

export const apiEndpoints = {
  dashboard: {
    metrics: "/dashboard/metrics",
    revenue: "/dashboard/revenue",
    ordersTrend: "/dashboard/orders-trend",
    mechanicWorkload: "/dashboard/mechanic-workload",
    recentActivity: "/dashboard/recent-activity",
    recentOrders: "/dashboard/recent-orders",
  },
  orders: {
    list: "/orders",
  },
  customers: {
    list: "/customers",
    detail: (customerId: string) => `/customers/${customerId}`,
  },
  vehicles: {
    list: "/vehicles",
    detail: (vehicleId: string) => `/vehicles/${vehicleId}`,
    serviceHistory: (vehicleId: string) => `/vehicles/${vehicleId}/service-history`,
  },
} as const;

export function toMswPath(path: string): string {
  return `${API_PREFIX}${path}`;
}
