import { DEFAULT_DASHBOARD_RANGE, DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT } from "../constants";
import type { DashboardRangeKey, DashboardRecentOrdersParamsKey } from "./types";

function normalizeRecentOrdersParams(params: DashboardRecentOrdersParamsKey = {}) {
  return {
    range: params.range ?? DEFAULT_DASHBOARD_RANGE,
    limit: params.limit ?? DEFAULT_DASHBOARD_RECENT_ORDERS_LIMIT,
  };
}

export const dashboardQueryKeys = {
  root: ["dashboard"] as const,
  metrics: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "metrics", range] as const,
  revenue: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "revenue", range] as const,
  ordersTrend: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "orders-trend", range] as const,
  mechanicWorkload: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "mechanic-workload", range] as const,
  recentActivity: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "recent-activity", range] as const,
  recentOrders: (params: DashboardRecentOrdersParamsKey = {}) =>
    ["dashboard", "recent-orders", normalizeRecentOrdersParams(params)] as const,
  overview: (range: DashboardRangeKey = DEFAULT_DASHBOARD_RANGE) =>
    ["dashboard", "overview", range] as const,
} as const;
