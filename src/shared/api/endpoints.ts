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
  mechanics: {
    registry: "/mechanics/registry",
    workload: "/mechanics/workload",
  },
  analytics: {
    metrics: "/analytics/metrics",
    revenue: "/analytics/revenue",
    ordersPerDay: "/analytics/orders-per-day",
    jobsByCategory: "/analytics/jobs-by-category",
    mechanicWorkload: "/analytics/mechanic-workload",
  },
  orders: {
    list: "/orders",
    detail: (orderId: string) => `/orders/${orderId}`,
    activity: (orderId: string) => `/orders/${orderId}/activity`,
    status: (orderId: string) => `/orders/${orderId}/status`,
    flag: (orderId: string) => `/orders/${orderId}/flag`,
  },
  workBoard: {
    board: "/work-board",
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
