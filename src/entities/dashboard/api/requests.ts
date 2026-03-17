import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { apiEndpoints } from "@/shared/api/endpoints";
import { httpRequest } from "@/shared/api/http-client";
import type {
  DashboardMetrics,
  DashboardOrdersTrendPoint,
  DashboardOverview,
  DashboardRange,
  DashboardRevenuePoint,
  MechanicWorkloadItem,
  RecentActivityItem,
  RecentOrderItem,
} from "../model/types";

export function getDashboardMetrics() {
  return httpRequest<DashboardMetrics>(apiEndpoints.dashboard.metrics, { method: "GET" });
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

export function getDashboardMechanicWorkload() {
  return httpRequest<MechanicWorkloadItem[]>(apiEndpoints.dashboard.mechanicWorkload, {
    method: "GET",
  });
}

export function getDashboardRecentActivity() {
  return httpRequest<RecentActivityItem[]>(apiEndpoints.dashboard.recentActivity, {
    method: "GET",
  });
}

export function getDashboardRecentOrders() {
  return httpRequest<RecentOrderItem[]>(apiEndpoints.dashboard.recentOrders, {
    method: "GET",
  });
}

export async function getDashboardOverview(
  range: DashboardRange = DEFAULT_DASHBOARD_RANGE,
): Promise<DashboardOverview> {
  const [metrics, revenue, ordersTrend, mechanicWorkload, recentActivity, recentOrders] =
    await Promise.all([
      getDashboardMetrics(),
      getDashboardRevenue(range),
      getDashboardOrdersTrend(range),
      getDashboardMechanicWorkload(),
      getDashboardRecentActivity(),
      getDashboardRecentOrders(),
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
