import { DEFAULT_DASHBOARD_RANGE } from "../constants";
import type { DashboardRangeKey } from "./types";

export const dashboardQueryKeys = {
  root: ["dashboard"] as const,
  metrics: () => ["dashboard", "metrics"] as const,
  revenue: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "revenue", range] as const,
  ordersTrend: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "orders-trend", range] as const,
  mechanicWorkload: () => ["dashboard", "mechanic-workload"] as const,
  recentActivity: () => ["dashboard", "recent-activity"] as const,
  recentOrders: () => ["dashboard", "recent-orders"] as const,
  overview: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "overview", range] as const,
} as const;
