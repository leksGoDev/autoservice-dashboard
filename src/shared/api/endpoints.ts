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
  vehicles: {
    list: "/vehicles",
  },
} as const;

export function toMswPath(path: string): string {
  return `${API_PREFIX}${path}`;
}
