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
    jobs: (orderId: string) => `/orders/${orderId}/jobs`,
  },
  jobs: {
    detail: (jobId: string) => `/jobs/${jobId}`,
    status: (jobId: string) => `/jobs/${jobId}/status`,
    assignMechanic: (jobId: string) => `/jobs/${jobId}/assign-mechanic`,
    parts: (jobId: string) => `/jobs/${jobId}/parts`,
  },
  jobParts: {
    detail: (jobPartId: string) => `/job-parts/${jobPartId}`,
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
  appointments: {
    list: "/appointments",
    detail: (appointmentId: string) => `/appointments/${appointmentId}`,
    convertToOrder: (appointmentId: string) => `/appointments/${appointmentId}/convert-to-order`,
  },
} as const;

export function toMswPath(path: string): string {
  return `${API_PREFIX}${path}`;
}
