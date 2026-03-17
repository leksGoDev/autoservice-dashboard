import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/shared/api/query-keys";
import type { DashboardRange } from "../model/types";
import {
  getDashboardMechanicWorkload,
  getDashboardMetrics,
  getDashboardOrdersTrend,
  getDashboardOverview,
  getDashboardRecentActivity,
  getDashboardRecentOrders,
  getDashboardRevenue,
} from "./requests";

export function useDashboardMetricsQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(),
    queryFn: getDashboardMetrics,
  });
}

export function useDashboardRevenueQuery(range: DashboardRange = "30d") {
  return useQuery({
    queryKey: queryKeys.dashboard.revenue(range),
    queryFn: () => getDashboardRevenue(range),
  });
}

export function useDashboardOrdersTrendQuery(range: DashboardRange = "30d") {
  return useQuery({
    queryKey: queryKeys.dashboard.ordersTrend(range),
    queryFn: () => getDashboardOrdersTrend(range),
  });
}

export function useDashboardMechanicWorkloadQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.mechanicWorkload(),
    queryFn: getDashboardMechanicWorkload,
  });
}

export function useDashboardRecentActivityQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(),
    queryFn: getDashboardRecentActivity,
  });
}

export function useDashboardRecentOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.recentOrders(),
    queryFn: getDashboardRecentOrders,
  });
}

export function useDashboardOverviewQuery(range: DashboardRange = "30d") {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(range),
    queryFn: () => getDashboardOverview(range),
  });
}
