import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type {
  DashboardRecentOrdersParams,
  DashboardMetrics,
  DashboardOrdersTrendPoint,
  DashboardOverview,
  DashboardRange,
  DashboardRevenuePoint,
  MechanicWorkloadItem,
  RecentActivityItem,
  RecentOrderItem,
} from "../model/types";

export function getDashboardMetrics(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<DashboardMetrics>(apiEndpoints.dashboard.metrics, {
    method: "GET",
    query: { range },
  });
}

export function getDashboardRevenue(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<DashboardRevenuePoint[]>(apiEndpoints.dashboard.revenue, {
    method: "GET",
    query: { range },
  });
}

export function getDashboardOrdersTrend(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<DashboardOrdersTrendPoint[]>(apiEndpoints.dashboard.ordersTrend, {
    method: "GET",
    query: { range },
  });
}

export function getDashboardMechanicWorkload(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<MechanicWorkloadItem[]>(apiEndpoints.dashboard.mechanicWorkload, {
    method: "GET",
    query: { range },
  });
}

export function getDashboardRecentActivity(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return httpRequest<RecentActivityItem[]>(apiEndpoints.dashboard.recentActivity, {
    method: "GET",
    query: { range },
  });
}

export function getDashboardRecentOrders(params: DashboardRecentOrdersParams = {}) {
  const range = params.range ?? DEFAULT_DASHBOARD_RANGE;
  const limit = params.limit;

  return httpRequest<RecentOrderItem[]>(apiEndpoints.dashboard.recentOrders, {
    method: "GET",
    query: { range, limit },
  });
}

export async function getDashboardOverview(
  range: DashboardRange = DEFAULT_DASHBOARD_RANGE,
): Promise<DashboardOverview> {
  const [metrics, revenue, ordersTrend, mechanicWorkload, recentActivity, recentOrders] =
    await Promise.all([
      getDashboardMetrics(range),
      getDashboardRevenue(range),
      getDashboardOrdersTrend(range),
      getDashboardMechanicWorkload(range),
      getDashboardRecentActivity(range),
      getDashboardRecentOrders({ range }),
    ]);

  return {
    metrics,
    revenue,
    ordersTrend,
    mechanicWorkload,
    recentActivity,
    recentOrders,
  };
}
