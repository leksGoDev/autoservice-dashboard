import { useQuery } from "@tanstack/react-query";

import { DEFAULT_DASHBOARD_RANGE } from "@/shared/api/constants";
import { queryKeys } from "@/shared/api/query-keys";
import type { DashboardRange, DashboardRecentOrdersParams } from "../model/types";
import {
  getDashboardMechanicWorkload,
  getDashboardMetrics,
  getDashboardOrdersTrend,
  getDashboardOverview,
  getDashboardRecentActivity,
  getDashboardRecentOrders,
  getDashboardRevenue,
} from "./requests";

export function useDashboardMetricsQuery(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics(range),
    queryFn: () => getDashboardMetrics(range),
  });
}

export function useDashboardRevenueQuery(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.dashboard.revenue(range),
    queryFn: () => getDashboardRevenue(range),
  });
}

export function useDashboardOrdersTrendQuery(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.dashboard.ordersTrend(range),
    queryFn: () => getDashboardOrdersTrend(range),
  });
}

export function useDashboardMechanicWorkloadQuery(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.dashboard.mechanicWorkload(range),
    queryFn: () => getDashboardMechanicWorkload(range),
  });
}

export function useDashboardRecentActivityQuery(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(range),
    queryFn: () => getDashboardRecentActivity(range),
  });
}

export function useDashboardRecentOrdersQuery(params: DashboardRecentOrdersParams = {}) {
  const range = params.range ?? DEFAULT_DASHBOARD_RANGE;
  const limit = params.limit;

  return useQuery({
    queryKey: queryKeys.dashboard.recentOrders({ range, limit }),
    queryFn: () => getDashboardRecentOrders({ range, limit }),
  });
}

export function useDashboardOverviewQuery(range: DashboardRange = DEFAULT_DASHBOARD_RANGE) {
  return useQuery({
    queryKey: queryKeys.dashboard.overview(range),
    queryFn: () => getDashboardOverview(range),
  });
}
