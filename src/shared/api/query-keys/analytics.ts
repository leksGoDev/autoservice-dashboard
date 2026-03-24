import { DEFAULT_DASHBOARD_RANGE } from "../constants";
import type { DashboardRangeKey } from "./types";

export const analyticsQueryKeys = {
  root: ["analytics"] as const,
  metrics: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) => ["analytics", "metrics", range] as const,
  revenue: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) => ["analytics", "revenue", range] as const,
  ordersPerDay: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["analytics", "orders-per-day", range] as const,
  jobsByCategory: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["analytics", "jobs-by-category", range] as const,
  mechanicWorkload: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["analytics", "mechanic-workload", range] as const,
  overview: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) => ["analytics", "overview", range] as const,
} as const;
