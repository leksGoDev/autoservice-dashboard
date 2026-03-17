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
  return httpRequest<DashboardMetrics>("/dashboard/metrics", { method: "GET" });
}

export function getDashboardRevenue(range: DashboardRange = "30d") {
  return httpRequest<DashboardRevenuePoint[]>("/dashboard/revenue", {
    method: "GET",
    query: { range },
  });
}

export function getDashboardOrdersTrend(range: DashboardRange = "30d") {
  return httpRequest<DashboardOrdersTrendPoint[]>("/dashboard/orders-trend", {
    method: "GET",
    query: { range },
  });
}

export function getDashboardMechanicWorkload() {
  return httpRequest<MechanicWorkloadItem[]>("/dashboard/mechanic-workload", {
    method: "GET",
  });
}

export function getDashboardRecentActivity() {
  return httpRequest<RecentActivityItem[]>("/dashboard/recent-activity", {
    method: "GET",
  });
}

export function getDashboardRecentOrders() {
  return httpRequest<RecentOrderItem[]>("/dashboard/recent-orders", {
    method: "GET",
  });
}

export async function getDashboardOverview(range: DashboardRange = "30d"): Promise<DashboardOverview> {
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
